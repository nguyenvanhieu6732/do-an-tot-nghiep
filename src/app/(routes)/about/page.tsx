import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Award, ThumbsUp, Truck, ShieldCheck, MapPin, Phone, Mail, Clock } from "lucide-react"

export const metadata: Metadata = {
    title: "Về chúng tôi - LUXMEN",
    description: "Tìm hiểu về LUXMEN - Thương hiệu thời trang nam cao cấp hàng đầu Việt Nam",
}

// Dữ liệu giả lập cho đội ngũ
const team = [
    {
        name: "Nguyễn Văn Hiếu",
        position: "Nhà sáng lập & CEO",
        image: "/avatar/avt-1.jpg",
        bio: "Với hơn 15 năm kinh nghiệm trong ngành thời trang, anh Nguyễn Văn Hiếu đã xây dựng LUXMEN trở thành thương hiệu thời trang nam cao cấp hàng đầu Việt Nam.",
    },
    {
        name: "Hiếu Nguyễn Văn",
        position: "Giám đốc Thiết kế",
        image: "/avatar/avt-2.jpg",
        bio: "Tốt nghiệp từ Học viện Thời trang Milano, anh Hiếu Nguyễn Văn mang đến LUXMEN những thiết kế độc đáo, kết hợp giữa phong cách hiện đại và truyền thống.",
    },
    {
        name: "Văn Hiếu Nguyễn",
        position: "Giám đốc Marketing",
        image: "/avatar/avt-3.jpg",
        bio: "Với kinh nghiệm làm việc tại các tập đoàn thời trang quốc tế, anh Văn Hiếu Nguyễn đã giúp LUXMEN xây dựng chiến lược marketing hiệu quả và định vị thương hiệu thành công.",
    },
    {
        name: "Hiếu Văn Nguyễn",
        position: "Giám đốc Sản xuất",
        image: "/avatar/avt-1.jpg",
        bio: "Anh Hiếu Văn Nguyễn chịu trách nhiệm quản lý quy trình sản xuất, đảm bảo mỗi sản phẩm của LUXMEN đều đạt chuẩn chất lượng cao nhất trước khi đến tay khách hàng.",
    },
]

// Dữ liệu giả lập cho các giá trị cốt lõi
const coreValues = [
    {
        icon: <Award className="h-8 w-8" />,
        title: "Chất lượng",
        description: "Chúng tôi cam kết mang đến những sản phẩm chất lượng cao nhất, được làm từ những chất liệu tốt nhất.",
    },
    {
        icon: <ThumbsUp className="h-8 w-8" />,
        title: "Phong cách",
        description:
            "Mỗi thiết kế của LUXMEN đều mang đến phong cách riêng biệt, giúp người đàn ông toát lên vẻ lịch lãm và đẳng cấp.",
    },
    {
        icon: <Truck className="h-8 w-8" />,
        title: "Dịch vụ",
        description: "Chúng tôi luôn đặt khách hàng lên hàng đầu, mang đến trải nghiệm mua sắm tuyệt vời nhất.",
    },
    {
        icon: <ShieldCheck className="h-8 w-8" />,
        title: "Uy tín",
        description: "LUXMEN tự hào là thương hiệu uy tín, luôn giữ vững cam kết và lời hứa với khách hàng.",
    },
]

// Dữ liệu giả lập cho các cột mốc
const milestones = [
    {
        year: "2010",
        title: "Thành lập LUXMEN",
        description: "LUXMEN được thành lập với cửa hàng đầu tiên tại Quận 1, TP. Hồ Chí Minh.",
    },
    {
        year: "2015",
        title: "Mở rộng thị trường",
        description:
            "LUXMEN mở rộng thị trường với 5 cửa hàng tại các thành phố lớn và ra mắt website bán hàng trực tuyến.",
    },
    {
        year: "2018",
        title: "Ra mắt dòng sản phẩm cao cấp",
        description: "LUXMEN ra mắt dòng sản phẩm cao cấp LUXMEN Premium với chất liệu nhập khẩu và thiết kế độc quyền.",
    },
    {
        year: "2020",
        title: "Kỷ niệm 10 năm thành lập",
        description:
            "LUXMEN kỷ niệm 10 năm thành lập với 20 cửa hàng trên toàn quốc và trở thành thương hiệu thời trang nam hàng đầu Việt Nam.",
    },
    {
        year: "2023",
        title: "Mở rộng thị trường quốc tế",
        description:
            "LUXMEN bắt đầu mở rộng thị trường quốc tế với cửa hàng đầu tiên tại Singapore và website bán hàng quốc tế.",
    },
]

export default function AboutPage() {
    return (
        <div>
            {/* Hero section */}
            <section className="relative h-[50vh] overflow-hidden">
                <Image
                    src="/about/banner-about-2.jpg"
                    alt="LUXMEN - Thời trang nam cao cấp"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container mx-auto px-4 text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Về chúng tôi</h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto">
                            LUXMEN - Thương hiệu thời trang nam cao cấp hàng đầu Việt Nam
                        </p>
                    </div>
                </div>
            </section>

            {/* Giới thiệu */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Câu chuyện của chúng tôi</h2>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                LUXMEN được thành lập vào năm 2010 với sứ mệnh mang đến những sản phẩm thời trang nam cao cấp, kết hợp
                                giữa phong cách hiện đại và đẳng cấp, giúp người đàn ông Việt Nam tự tin thể hiện cá tính và phong cách
                                riêng của mình.
                            </p>
                            <p className="text-muted-foreground">
                                Trải qua hơn 10 năm phát triển, LUXMEN đã trở thành thương hiệu thời trang nam hàng đầu Việt Nam với hệ
                                thống hơn 20 cửa hàng trên toàn quốc và website bán hàng trực tuyến. Chúng tôi tự hào mang đến cho khách
                                hàng những sản phẩm chất lượng cao, thiết kế độc đáo và dịch vụ tận tâm.
                            </p>
                            <p className="text-muted-foreground">
                                Tại LUXMEN, chúng tôi tin rằng thời trang không chỉ là những bộ quần áo, mà còn là cách để thể hiện cá
                                tính và phong cách sống. Chúng tôi cam kết mang đến những sản phẩm chất lượng cao nhất, được làm từ
                                những chất liệu tốt nhất, giúp người đàn ông Việt Nam tự tin và thành công trong mọi lĩnh vực.
                            </p>
                        </div>
                        <div className="mt-8">
                            <Button asChild>
                                <Link href="/collections">Khám phá bộ sưu tập</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="relative aspect-square md:aspect-[4/5] rounded-lg overflow-hidden">
                        <Image src="/about/banner-about-1.jpg" alt="LUXMEN Store" fill className="object-cover" />
                    </div>
                </div>
            </section>

            {/* Giá trị cốt lõi */}
            <section className="bg-muted py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Những giá trị cốt lõi định hình nên thương hiệu LUXMEN và cam kết của chúng tôi với khách hàng
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {coreValues.map((value, index) => (
                            <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                                <div className="flex justify-center items-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-center mb-3">{value.title}</h3>
                                <p className="text-muted-foreground text-center">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cột mốc phát triển */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Cột mốc phát triển</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Hành trình phát triển của LUXMEN qua các năm</p>
                </div>

                <div className="relative">
                    {/* Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-muted-foreground/20"></div>

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} gap-8`}
                            >
                                <div className="w-full md:w-1/2 flex justify-end">
                                    <div
                                        className={`bg-muted p-6 rounded-lg shadow-sm ${index % 2 === 0 ? "text-right" : "text-left"} max-w-md`}
                                    >
                                        <span className="text-primary font-bold">{milestone.year}</span>
                                        <h3 className="text-xl font-bold mt-2 mb-3">{milestone.title}</h3>
                                        <p className="text-muted-foreground">{milestone.description}</p>
                                    </div>
                                </div>

                                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                                    <div className="h-4 w-4 rounded-full bg-primary"></div>
                                </div>

                                <div className="w-full md:w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Đội ngũ */}
            <section className="bg-muted py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Gặp gỡ những con người tài năng đằng sau thành công của LUXMEN
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="bg-background rounded-lg overflow-hidden shadow-sm">
                                <div className="relative aspect-square">
                                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                    <p className="text-primary text-sm mb-4">{member.position}</p>
                                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Thông tin liên hệ */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h2>
                        <p className="text-muted-foreground mb-8">
                            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc
                            góp ý nào.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                                <div>
                                    <h3 className="font-medium mb-1">Địa chỉ</h3>
                                    <p className="text-muted-foreground">Khương Đình, Thanh Xuân, Hà Nội</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                                <div>
                                    <h3 className="font-medium mb-1">Điện thoại</h3>
                                    <p className="text-muted-foreground">+84 901 572 003</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                                <div>
                                    <h3 className="font-medium mb-1">Email</h3>
                                    <p className="text-muted-foreground">Nguyenhieu6732@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                                <div>
                                    <h3 className="font-medium mb-1">Giờ làm việc</h3>
                                    <p className="text-muted-foreground">Thứ 2 - Chủ nhật: 9:00 - 21:00</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button asChild>
                                <Link href="/contact">Gửi tin nhắn</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                        <Image src="/about/banner-about-3.jpg" alt="LUXMEN Office" fill className="object-cover" />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary text-primary-foreground py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Trở thành một phần của LUXMEN</h2>
                    <p className="max-w-2xl mx-auto mb-8">
                        Khám phá bộ sưu tập mới nhất của chúng tôi và trải nghiệm sự khác biệt của LUXMEN
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="secondary" size="lg" asChild>
                            <Link href="/collections">Khám phá bộ sưu tập</Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                            asChild
                        >
                            <Link href="/contact">Liên hệ với chúng tôi</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

