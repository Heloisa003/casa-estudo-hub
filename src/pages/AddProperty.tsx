import { useState } from "react";
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
import { ArrowLeft, Upload, X, Home } from "lucide-react";

const propertySchema = z.object({
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres").max(100, "Título muito longo"),
  property_type: z.enum(["house", "apartment", "kitnet", "commercial"], {
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
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      navigate("/property-management");
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/property-management")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Cadastrar Novo Imóvel
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para adicionar seu imóvel à plataforma
            </p>
          </div>

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
                      onValueChange={(value) => setValue("property_type", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">Casa</SelectItem>
                        <SelectItem value="apartment">Apartamento</SelectItem>
                        <SelectItem value="kitnet">Kitnet</SelectItem>
                        <SelectItem value="commercial">Comercial</SelectItem>
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
        </div>
      </main>
    </div>
  );
};

export default AddProperty;
