import Sidebar from '@/components/layout/sidebar'
import Navbar from '@/components/layout/navbar'
import ProductModal from '@/components/product/product-modal'
import SearchCommand from '@/components/search/search-command'
import QuickAddModal from '@/components/paste/quick-add-modal'
import DataInitializer from '@/components/shared/data-initializer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DataInitializer />
      <div className="flex min-h-screen bg-transparent">
        <Sidebar />

        <div className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-out pl-0 lg:pl-[280px]">
          <Navbar />

          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 pb-8">
            {children}
          </main>
        </div>

        <ProductModal />
        <SearchCommand />
        <QuickAddModal />
      </div>
    </>
  )
}
