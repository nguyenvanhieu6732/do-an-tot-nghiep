import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

export const metadata: Metadata = {
  title: "Liên hệ - LUXMEN",
  description: "Liên hệ với LUXMEN - Thương hiệu thời trang nam cao cấp hàng đầu Việt Nam",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tiêu đề trang */}
      <div className="flex flex-col space-y-4 mb-12 text-center">
        <h1 className="text-3xl font-bold">Liên hệ</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc góp
          ý nào.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Thông tin liên hệ */}
        <div className="lg:col-span-1">
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6">Thông tin liên hệ</h2>

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
              <h3 className="font-medium mb-3">Theo dõi chúng tôi</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-youtube"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Form liên hệ */}
        <div className="lg:col-span-2">
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Họ tên
                  </label>
                  <Input id="name" placeholder="Nhập họ tên của bạn" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Nhập email của bạn" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Số điện thoại
                </label>
                <Input id="phone" placeholder="Nhập số điện thoại của bạn" />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Tiêu đề
                </label>
                <Input id="subject" placeholder="Nhập tiêu đề tin nhắn" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Nội dung
                </label>
                <Textarea id="message" placeholder="Nhập nội dung tin nhắn" rows={5} />
              </div>

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Gửi tin nhắn
              </Button>
            </form>
          </div>
        </div>
      </div>



      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-6">Câu hỏi thường gặp</h2>

        <div className="space-y-4">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-medium mb-2">Làm thế nào để đặt hàng trực tuyến?</h3>
            <p className="text-muted-foreground">
              Bạn có thể đặt hàng trực tuyến bằng cách truy cập website của chúng tôi, chọn sản phẩm bạn muốn mua, thêm
              vào giỏ hàng và tiến hành thanh toán. Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau như thẻ
              tín dụng, chuyển khoản ngân hàng và thanh toán khi nhận hàng.
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-medium mb-2">Chính sách đổi trả như thế nào?</h3>
            <p className="text-muted-foreground">
              Chúng tôi chấp nhận đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên trạng,
              còn nguyên tem mác và có hóa đơn mua hàng. Vui lòng liên hệ với chúng tôi trước khi gửi sản phẩm trả lại.
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-medium mb-2">Thời gian giao hàng là bao lâu?</h3>
            <p className="text-muted-foreground">
              Thời gian giao hàng thông thường là 2-3 ngày làm việc đối với các thành phố lớn và 3-5 ngày làm việc đối
              với các tỉnh thành khác. Thời gian giao hàng có thể thay đổi tùy thuộc vào địa điểm và tình trạng kho
              hàng.
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-medium mb-2">Làm thế nào để biết size phù hợp?</h3>
            <p className="text-muted-foreground">
              Chúng tôi cung cấp bảng size chi tiết cho từng sản phẩm. Bạn có thể tham khảo bảng size này để chọn size
              phù hợp với mình. Nếu bạn vẫn không chắc chắn, vui lòng liên hệ với chúng tôi để được tư vấn.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

