import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="logo.png"
                alt="SilkLux Logo"
                width={120}
                height={40}
                className="h-14 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300">
              Premium luxury paint solutions crafted with silk-like finishes. Elevating spaces with unparalleled quality
              and sophistication.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-300 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/products" className="hover:text-white">
                  Interior Paint
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  Exterior Paint
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  Luxury Finishes
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  Primers
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  Specialty Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Colors</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/colors" className="hover:text-white">
                  Explore Colors
                </Link>
              </li>
              <li>
                <Link href="/color-match" className="hover:text-white">
                  Color Matching
                </Link>
              </li>
              <li>
                <Link href="/colors" className="hover:text-white">
                  Popular Colors
                </Link>
              </li>
              <li>
                <Link href="/paint-ideas" className="hover:text-white">
                  Color Trends
                </Link>
              </li>
              <li>
                <Link href="/paint-ideas" className="hover:text-white">
                  Design Ideas
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Connected</h3>
            <p className="text-gray-300">Get the latest color trends and luxury paint innovations.</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">© 2024 SilkLux. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-300 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Use
            </Link>
            <Link href="#" className="hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
