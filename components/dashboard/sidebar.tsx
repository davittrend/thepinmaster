import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Accounts", href: "/dashboard/accounts" },
  { name: "Schedule Pins", href: "/dashboard/schedule" },
  { name: "Scheduled Pins", href: "/dashboard/scheduled" },
]

export function DashboardSidebar() {
  const location = useLocation()

  return (
    <div className="flex h-full w-64 flex-col border-r">
      <div className="flex h-14 items-center border-b px-4 font-semibold">
        Dashboard
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

