import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X, Home, TrendingUp, DollarSign, Users, Eye, Plus, MapPin, Bed, Bath, Power, Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const propertySchema = z.object({
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres").max(100, "Título muito longo"),
  property_type: z.enum(["casa", "apartamento", "kitnet", "quarto_individual", "quarto_compartilhado", "comercial"], {
    required_error: "Selecione o tipo do imóvel"
  }),
  price: z.string().min(1, "Preço é obrigatório"),
  bedrooms: z.string().min(1, "Número de quartos é obrigatório"),
  bathrooms: z.string().min(1, "Número de banheiros é obrigatório"),
  max_occupants: z.string().min(1, "Número máximo de ocupantes é obrigatório"),
  available_spots: z.string().min(1, "Vagas disponíveis é obrigatório"),
  address: z.string().min(5, "Endereço é obrigatório"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório").max(2, "Use a sigla do estado (ex: SP)"),
  description: z.string().min(20, "Descrição deve ter no mínimo 20 caracteres").max(1000, "Descrição muito longa"),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const amenitiesList = [
  { id: "wifi", label: "Wi-Fi" },
  { id: "furnished", label: "Mobiliado" },
  { id: "air_conditioning", label: "Ar-condicionado" },
  { id: "pets_allowed", label: "Aceita Pets" },
  { id: "pool", label: "Piscina" },
  { id: "security", label: "Portaria 24h" },
  { id: "gym", label: "Academia" },
  { id: "parking", label: "Garagem" },
  { id: "elevator", label: "Elevador" },
  { id: "grill", label: "Churrasqueira" },
];

const AddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [deletePropertyId, setDeletePropertyId] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0,
    monthlyRevenue: 0,
    occupancyRate: 0
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const propertyType = watch("property_type");

  useEffect(() => {
    if (user) {
      loadStats();
      loadProperties();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id);

      if (error) throw error;

      const total = properties?.length || 0;
      const active = properties?.filter(p => p.is_available).length || 0;
      const occupied = total - active;
      const revenue = properties
        ?.filter(p => !p.is_available)
        .reduce((sum, p) => sum + Number(p.price), 0) || 0;
      const occupancy = total > 0 ? Math.round((occupied / total) * 100) : 0;

      // Contar visualizações de todos os imóveis do usuário
      let views = 0;
      const propertyIds = properties?.map(p => p.id) || [];
      
      if (propertyIds.length > 0) {
        const { count } = await supabase
          .from('property_views')
          .select('*', { count: 'exact', head: true })
          .in('property_id', propertyIds);
        
        views = count || 0;
      }

      setStats({
        totalProperties: total,
        activeProperties: active,
        totalViews: views,
        monthlyRevenue: revenue,
        occupancyRate: occupancy
      });
    } catch (error: any) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const loadProperties = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar imóveis:", error);
    }
  };

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_available: !currentStatus })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: !currentStatus ? "Imóvel ativado" : "Imóvel desativado",
        description: !currentStatus 
          ? "O imóvel está agora visível para locadores" 
          : "O imóvel foi ocultado do público"
      });

      loadProperties();
      loadStats();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: "Imóvel excluído",
        description: "O imóvel foi removido com sucesso"
      });

      loadProperties();
      loadStats();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir imóvel",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 10) {
      toast({
        title: "Limite de imagens",
        description: "Você pode enviar no máximo 10 imagens",
        variant: "destructive",
      });
      return;
    }

    const validImages = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Formato inválido",
          description: `${file.name} não é uma imagem válida`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede 5MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validImages]);

    validImages.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar um imóvel",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Imagens obrigatórias",
        description: "Adicione pelo menos uma imagem do imóvel",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload das imagens
      const imageUrls: string[] = [];
      
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('property-images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      // Inserir o imóvel no banco
      const { error: insertError } = await supabase
        .from('properties')
        .insert({
          owner_id: user.id,
          title: data.title,
          property_type: data.property_type,
          price: parseFloat(data.price),
          bedrooms: parseInt(data.bedrooms),
          bathrooms: parseInt(data.bathrooms),
          max_occupants: parseInt(data.max_occupants),
          available_spots: parseInt(data.available_spots),
          address: data.address,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          description: data.description,
          amenities: selectedAmenities,
          images: imageUrls,
          is_available: true,
        } as any);

      if (insertError) throw insertError;

      toast({
        title: "Sucesso!",
        description: "Imóvel cadastrado com sucesso",
      });

      // Recarregar estatísticas e propriedades
      await loadStats();
      await loadProperties();
      
      // Voltar para a lista
      setShowForm(false);
      
      // Resetar formulário
      setImages([]);
      setImagePreviews([]);
      setSelectedAmenities([]);
    } catch (error: any) {
      console.error("Erro ao cadastrar imóvel:", error);
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Ocorreu um erro ao cadastrar o imóvel",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      casa: "Casa",
      apartamento: "Apartamento",
      kitnet: "Kitnet",
      quarto_individual: "Quarto Individual",
      quarto_compartilhado: "Quarto Compartilhado",
      comercial: "Comercial"
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12 max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => showForm ? setShowForm(false) : navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              {showForm ? "Cadastrar Novo Imóvel" : "Meus Imóveis"}
            </h1>
            <p className="text-muted-foreground">
              {showForm 
                ? "Preencha os dados abaixo para adicionar seu imóvel à plataforma"
                : "Gerencie seus imóveis cadastrados e acompanhe suas estatísticas"
              }
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Imóveis Ativos</p>
                    <p className="text-2xl font-bold text-secondary">{stats.activeProperties}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.totalProperties} total
                    </p>
                  </div>
                  <Home className="w-8 h-8 text-secondary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Visualizações</p>
                    <p className="text-2xl font-bold text-accent">{stats.totalViews}</p>
                    <p className="text-xs text-muted-foreground mt-1">Este mês</p>
                  </div>
                  <Eye className="w-8 h-8 text-accent opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Ganhos Mensais</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Imóveis ocupados</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Taxa de Ocupação</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.occupancyRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.totalProperties - stats.activeProperties} ocupados
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {!showForm ? (
            <>
              {/* Botão para adicionar novo imóvel */}
              <div className="mb-8 flex justify-end">
                <Button
                  onClick={() => setShowForm(true)}
                  size="lg"
                  className="gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Novo Imóvel
                </Button>
              </div>

              {/* Lista de Imóveis */}
              {properties.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center">
                    <Home className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Nenhum imóvel cadastrado</h3>
                    <p className="text-muted-foreground mb-6">
                      Comece adicionando seu primeiro imóvel à plataforma
                    </p>
                    <Button onClick={() => setShowForm(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Cadastrar Primeiro Imóvel
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={property.images?.[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        {!property.is_available && (
                          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
                            Desativado
                          </div>
                        )}
                        {property.is_available && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            Ativo
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2 line-clamp-1">{property.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {property.address}, {property.neighborhood}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {property.city} - {property.state}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            {property.bedrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            {property.bathrooms}
                          </span>
                          <span className="text-xs bg-secondary/20 px-2 py-1 rounded">
                            {getPropertyTypeLabel(property.property_type)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <p className="text-2xl font-bold text-primary">
                              R$ {Number(property.price).toLocaleString('pt-BR')}
                            </p>
                            <p className="text-xs text-muted-foreground">por mês</p>
                          </div>
                        </div>

                        {/* Controles do Proprietário */}
                        <div className="space-y-3 pt-3 border-t">
                          {/* Toggle Ativar/Desativar */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Power className={`w-4 h-4 ${property.is_available ? 'text-green-600' : 'text-muted-foreground'}`} />
                              <span className="text-sm font-medium">
                                {property.is_available ? 'Visível para locadores' : 'Oculto do público'}
                              </span>
                            </div>
                            <Switch
                              checked={property.is_available}
                              onCheckedChange={() => togglePropertyStatus(property.id, property.is_available)}
                            />
                          </div>

                          {/* Botões de Ação */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => navigate(`/property/${property.id}`)}
                            >
                              Ver Detalhes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast({
                                title: "Em desenvolvimento",
                                description: "Função de edição em breve"
                              })}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletePropertyId(property.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-secondary" />
                  Informações Básicas
                </CardTitle>
                <CardDescription>Dados principais do imóvel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Imóvel *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Ex: Apartamento 2 quartos no centro"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="property_type">Tipo do Imóvel *</Label>
                    <Select
                      value={propertyType}
                      onValueChange={(value) => setValue("property_type", value as any, { shouldValidate: true })}
                    >
                      <SelectTrigger id="property_type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="kitnet">Kitnet</SelectItem>
                        <SelectItem value="quarto_individual">Quarto Individual</SelectItem>
                        <SelectItem value="quarto_compartilhado">Quarto Compartilhado</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.property_type && (
                      <p className="text-sm text-destructive mt-1">{errors.property_type.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="price">Preço do Aluguel (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register("price")}
                      placeholder="1500.00"
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Quartos *</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      {...register("bedrooms")}
                      placeholder="2"
                    />
                    {errors.bedrooms && (
                      <p className="text-sm text-destructive mt-1">{errors.bedrooms.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Banheiros *</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="0"
                      {...register("bathrooms")}
                      placeholder="1"
                    />
                    {errors.bathrooms && (
                      <p className="text-sm text-destructive mt-1">{errors.bathrooms.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="max_occupants">Ocupantes *</Label>
                    <Input
                      id="max_occupants"
                      type="number"
                      min="1"
                      {...register("max_occupants")}
                      placeholder="4"
                    />
                    {errors.max_occupants && (
                      <p className="text-sm text-destructive mt-1">{errors.max_occupants.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="available_spots">Vagas *</Label>
                    <Input
                      id="available_spots"
                      type="number"
                      min="0"
                      {...register("available_spots")}
                      placeholder="1"
                    />
                    {errors.available_spots && (
                      <p className="text-sm text-destructive mt-1">{errors.available_spots.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>Localização do imóvel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Endereço Completo *</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="Rua, número, complemento"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      {...register("neighborhood")}
                      placeholder="Centro"
                    />
                    {errors.neighborhood && (
                      <p className="text-sm text-destructive mt-1">{errors.neighborhood.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="São Paulo"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">Estado (UF) *</Label>
                    <Input
                      id="state"
                      {...register("state")}
                      placeholder="SP"
                      maxLength={2}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
                <CardDescription>Descreva detalhes importantes do imóvel</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...register("description")}
                  placeholder="Descreva o imóvel, suas características, localização, proximidade de estabelecimentos, etc."
                  rows={6}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Comodidades */}
            <Card>
              <CardHeader>
                <CardTitle>Comodidades</CardTitle>
                <CardDescription>Selecione as comodidades disponíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={selectedAmenities.includes(amenity.id)}
                        onCheckedChange={() => toggleAmenity(amenity.id)}
                      />
                      <Label
                        htmlFor={amenity.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {amenity.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upload de Imagens */}
            <Card>
              <CardHeader>
                <CardTitle>Fotos do Imóvel *</CardTitle>
                <CardDescription>
                  Adicione até 10 fotos (máximo 5MB cada)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Clique para enviar</span> ou arraste as imagens
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 5MB)</p>
                    </div>
                    <input
                      id="images"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botões */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/property-management")}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Cadastrando..." : "Cadastrar Imóvel"}
              </Button>
            </div>
          </form>
          )}
        </div>

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={!!deletePropertyId} onOpenChange={() => setDeletePropertyId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O imóvel será permanentemente excluído da plataforma.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deletePropertyId) {
                    handleDeleteProperty(deletePropertyId);
                    setDeletePropertyId(null);
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default AddProperty;
