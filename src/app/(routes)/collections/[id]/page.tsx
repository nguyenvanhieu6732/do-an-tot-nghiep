import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dữ liệu giả lập cho các bộ sưu tập
const collections = [
  {
    id: 1,
    name: "Thu Đông 2024",
    description: "Khám phá phong cách mới với những thiết kế độc đáo và sang trọng cho mùa thu đông",
    longDescription: `
      Bộ sưu tập Thu Đông 2024 của LUXMEN mang đến những thiết kế đẳng cấp và sang trọng, 
      phù hợp với thời tiết se lạnh của mùa thu và giá lạnh của mùa đông. 
      
      Với chất liệu cao cấp như len cashmere, da thật và cotton organic, 
      bộ sưu tập này không chỉ mang lại sự ấm áp mà còn thể hiện phong cách thời thượng 
      và đẳng cấp của người đàn ông hiện đại.
      
      Các thiết kế trong bộ sưu tập này đều được chăm chút tỉ mỉ từng chi tiết, 
      từ đường may sắc sảo đến các phụ kiện đi kèm, tạo nên một tổng thể hoàn hảo.
    `,
    image: "/placeholder.svg?height=800&width=1200",
    coverImage: "/placeholder.svg?height=1080&width=1920",
    slug: "autumn-winter-2024",
    featured: true,
    releaseDate: "2024-08-15",
    products: [1, 3, 4],
    lookbook: [
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
    ],
  },
  {
    id: 2,
    name: "Phong cách công sở",
    description: "Lịch lãm và chuyên nghiệp với các mẫu vest, áo sơ mi cao cấp",
    longDescription: `
      Bộ sưu tập Phong cách công sở của LUXMEN mang đến những thiết kế lịch lãm và chuyên nghiệp, 
      phù hợp với môi trường làm việc hiện đại. 
      
      Với các mẫu vest, áo sơ mi, quần âu được thiết kế tinh tế và sắc sảo, 
      bộ sưu tập này giúp người đàn ông toát lên vẻ tự tin và đẳng cấp nơi công sở.
      
      Chất liệu cao cấp cùng với kiểu dáng vừa vặn sẽ mang lại cảm giác thoải mái 
      cho người mặc trong suốt ngày dài làm việc.
    `,
    image: "/placeholder.svg?height=800&width=1200",
    coverImage: "/placeholder.svg?height=1080&width=1920",
    slug: "office-wear",
    featured: false,
    releaseDate: "2024-01-10",
    products: [1, 2],
    lookbook: [
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
    ],
  },
  {
    id: 3,
    name: "Thời trang dạo phố",
    description: "Thoải mái và phong cách với các thiết kế casual hiện đại",
    longDescription: `
      Bộ sưu tập Thời trang dạo phố của LUXMEN mang đến những thiết kế thoải mái và phong cách, 
      phù hợp cho các hoạt động hàng ngày và dạo phố cuối tuần. 
      
      Với các mẫu áo thun, áo polo, quần jeans và áo khoác casual được thiết kế hiện đại, 
      bộ sưu tập này giúp người đàn ông toát lên vẻ năng động và cá tính.
      
      Chất liệu thoáng mát và dễ chịu cùng với kiểu dáng vừa vặn sẽ mang lại cảm giác thoải mái 
      cho người mặc trong mọi hoạt động hàng ngày.
    `,
    image: "/placeholder.svg?height=800&width=1200",
    coverImage: "/placeholder.svg?height=1080&width=1920",
    slug: "casual",
    featured: false,
    releaseDate: "2024-03-20",
    products: [3],
    lookbook: [
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
      "/placeholder.svg?height=800&width=600",
    ],
  },
];

// Dữ liệu giả lập cho sản phẩm
const products = [
  {
    id: 1,
    name: "Áo sơ mi Oxford",
    price: 850000,
    salePrice: null,
    image: "/placeholder.svg?height=600&width=400",
    slug: "oxford-shirt",
  },
  {
    id: 2,
    name: "Qu youChinos Slim-fit",
    price: 950000,
    salePrice: 750000,
    image: "/placeholder.svg?height=600&width=400",
    slug: "slim-fit-chinos",
  },
  {
    id: 3,
    name: "Áo khoác Bomber",
    price: 1250000,
    salePrice: null,
    image: "/placeholder.svg?height=600&width=400",
    slug: "bomber-jacket",
  },
  {
    id: 4,
    name: "Giày Chelsea Boots",
    price: 1850000,
    salePrice: 1550000,
    image: "/placeholder.svg?height=600&width=400",
    slug: "chelsea-boots",
  },
];

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const resolvedParams = await params; // Chờ params resolve
  const collection = collections.find((c) => c.id === Number(resolvedParams.id));

  if (!collection) {
    return {
      title: "Bộ sưu tập không tồn tại - LUXMEN",
      description: "Bộ sưu tập bạn đang tìm kiếm không tồn tại",
    };
  }

  return {
    title: `${collection.name} - LUXMEN`,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params; // Chờ params resolve
  // Tìm bộ sưu tập theo id
  const collection = collections.find((c) => c.id === Number(resolvedParams.id));

  // Nếu không tìm thấy, trả về trang 404
  if (!collection) {
    notFound();
  }

  // Lấy danh sách sản phẩm của bộ sưu tập
  const collectionProducts = products.filter((product) => collection.products.includes(product.id));

  // Format giá
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format ngày
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div>
      {/* Hero section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={collection.coverImage || collection.image}
          alt={collection.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{collection.name}</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">{collection.description}</p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="rounded-full px-8">
                Mua ngay
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 bg-transparent border-white text-white hover:bg-white hover:text-black"
              >
                Xem lookbook
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Collection details */}
      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none mb-8">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="lookbook">Lookbook</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
                <div className="prose max-w-none">
                  {collection.longDescription.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-8">
                  <p className="text-sm text-muted-foreground">
                    Ngày ra mắt:{" "}
                    <span className="font-medium text-foreground">{formatDate(collection.releaseDate)}</span>
                  </p>
                </div>
              </div>
              <div>
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Featured products preview */}
            {collectionProducts.length > 0 && (
              <div className="mt-16">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
                  <Button variant="outline" asChild>
                    <Link href="#products">Xem tất cả</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {collectionProducts.slice(0, 4).map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`} className="group">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="font-medium group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="mt-2">
                        {product.salePrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatPrice(product.salePrice)}</span>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="products" id="products">
            {collectionProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {collectionProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="mt-2">
                      {product.salePrice ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{formatPrice(product.salePrice)}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Chưa có sản phẩm nào trong bộ sưu tập này.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="lookbook">
            {collection.lookbook && collection.lookbook.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collection.lookbook.map((image, index) => (
                  <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${collection.name} lookbook ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Chưa có hình ảnh lookbook nào cho bộ sưu tập này.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}