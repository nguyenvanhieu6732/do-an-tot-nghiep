"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Mail } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setEmail("")
    }, 1000)
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-muted rounded-lg p-8 md:p-12"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-6">
            <Mail className="h-6 w-6" />
          </div>

          <h2 className="text-3xl font-bold mb-4">Đăng ký nhận thông tin</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Đăng ký để nhận thông tin về các bộ sưu tập mới, khuyến mãi đặc biệt và các sự kiện độc quyền từ LUXMEN
          </p>

          {submitted ? (
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Check className="h-5 w-5" />
              <span>Cảm ơn bạn đã đăng ký!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  )
}

