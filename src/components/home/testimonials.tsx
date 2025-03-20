"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Văn Hiếu",
    role: "Doanh nhân",
    content:
      "Tôi rất hài lòng với chất lượng sản phẩm của LUXMEN. Áo vest tôi mua vừa vặn hoàn hảo và chất liệu rất tốt. Nhân viên tư vấn rất nhiệt tình và chuyên nghiệp.",
    rating: 5,
    avatar: "/avatar/avt-1.jpg",
  },
  {
    id: 2,
    name: "Văn Hiếu Nguyễn",
    role: "Giám đốc marketing",
    content:
      "LUXMEN là thương hiệu thời trang nam ưa thích của tôi. Tôi đã mua nhiều sản phẩm từ họ và chưa bao giờ thất vọng. Dịch vụ khách hàng xuất sắc và giao hàng nhanh chóng.",
    rating: 5,
    avatar: "/avatar/avt-2.jpg",
  },
  {
    id: 3,
    name: "Hiếu Hiếu Nguyễn",
    role: "Kỹ sư phần mềm",
    content:
      "Tôi thích phong cách thiết kế hiện đại và chất lượng sản phẩm của LUXMEN. Giá cả hợp lý cho chất lượng mà bạn nhận được. Chắc chắn sẽ mua lại.",
    rating: 4,
    avatar: "/avatar/avt-3.jpg",
  },
]

export default function Testimonials() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Khách hàng nói gì về chúng tôi</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Những đánh giá chân thực từ khách hàng đã trải nghiệm sản phẩm và dịch vụ của LUXMEN
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {testimonials.map((testimonial) => (
          <motion.div key={testimonial.id} variants={item} className="bg-muted p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>

            <div className="flex mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>

            <p className="text-muted-foreground">{testimonial.content}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

