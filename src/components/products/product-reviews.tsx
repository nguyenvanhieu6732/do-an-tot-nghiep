"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductReviewsProps {
  productId: number
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviewFilter, setReviewFilter] = useState("all")

  // Giả lập dữ liệu đánh giá
  const reviewStats = {
    average: 4.8,
    total: 124,
    distribution: [
      { rating: 5, count: 98, percentage: 79 },
      { rating: 4, count: 20, percentage: 16 },
      { rating: 3, count: 4, percentage: 3 },
      { rating: 2, count: 1, percentage: 1 },
      { rating: 1, count: 1, percentage: 1 },
    ],
  }

  const reviews = [
    {
      id: 1,
      author: "Nguyễn Văn A",
      avatar: "/avatar/avt-1.jpg",
      rating: 5,
      date: "15/06/2024",
      title: "Sản phẩm tuyệt vời",
      content:
        "Chất lượng sản phẩm rất tốt, đúng như mô tả. Vải mềm, thoáng khí và rất thoải mái khi mặc. Tôi rất hài lòng với sản phẩm này.",
      helpful: 12,
    },
    {
      id: 2,
      author: "Trần Văn B",
      avatar: "/avatar/avt-2.jpg",
      rating: 5,
      date: "10/06/2024",
      title: "Sản phẩm tốt",
      content: "Sản phẩm đẹp, chất lượng tốt. Tuy nhiên size hơi rộng một chút so với mô tả.",
      helpful: 5,
    },
    {
      id: 3,
      author: "Lê Văn C",
      avatar: "/avatar/avt-3.jpg",
      rating: 5,
      date: "05/06/2024",
      title: "Rất ưng ý",
      content:
        "Đây là lần thứ 3 tôi mua sản phẩm từ LUXMEN và chưa bao giờ thất vọng. Chất lượng luôn đảm bảo và dịch vụ khách hàng tuyệt vời.",
      helpful: 8,
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Review summary */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center p-6 bg-muted rounded-lg">
            <h3 className="text-2xl font-bold">{reviewStats.average}/5</h3>
            <div className="flex my-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-5 w-5 ${
                    index < Math.floor(reviewStats.average)
                      ? "fill-primary text-primary"
                      : index < reviewStats.average
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">Dựa trên {reviewStats.total} đánh giá</p>

            <div className="w-full space-y-2">
              {reviewStats.distribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="text-sm w-6">{item.rating}★</span>
                  <Progress value={item.percentage} className="h-2" />
                  <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full">Viết đánh giá</Button>
          </div>
        </div>

        {/* Reviews list */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Đánh giá của khách hàng</h3>
            <Select value={reviewFilter} onValueChange={setReviewFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc đánh giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đánh giá</SelectItem>
                <SelectItem value="5">5 sao</SelectItem>
                <SelectItem value="4">4 sao</SelectItem>
                <SelectItem value="3">3 sao</SelectItem>
                <SelectItem value="2">2 sao</SelectItem>
                <SelectItem value="1">1 sao</SelectItem>
                <SelectItem value="with-images">Có hình ảnh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border-b pb-6"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={review.avatar || "/placeholder.svg"}
                      alt={review.author}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="font-medium">{review.author}</h4>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>

                    <div className="flex mt-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${
                            index < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>

                    <h5 className="font-medium mt-2">{review.title}</h5>
                    <p className="text-muted-foreground mt-1">{review.content}</p>



                    <div className="flex items-center mt-4">
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        Hữu ích ({review.helpful})
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Write review form */}
          <div className="mt-8 p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Viết đánh giá của bạn</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Đánh giá</label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Button key={index} variant="ghost" size="icon" className="h-8 w-8">
                      <Star className="h-5 w-5" />
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="review-title" className="block text-sm font-medium mb-1">
                  Tiêu đề
                </label>
                <input
                  id="review-title"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Nhập tiêu đề đánh giá"
                />
              </div>

              <div>
                <label htmlFor="review-content" className="block text-sm font-medium mb-1">
                  Nội dung
                </label>
                <Textarea id="review-content" placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này" rows={4} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hình ảnh (tùy chọn)</label>
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  <p className="text-sm text-muted-foreground">Kéo và thả hình ảnh vào đây hoặc</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Chọn hình ảnh
                  </Button>
                </div>
              </div>

              <Button>Gửi đánh giá</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

