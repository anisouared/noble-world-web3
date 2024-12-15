import { WalletIcon, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const NotAuthorized = () => {
    return (
        <div className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="h-full flex items-start sm:items-center justify-center">
                <Card className="w-full max-w-[480px] shadow-lg">
                    <CardHeader className="text-center space-y-2">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <ShieldAlert className="w-7 h-7 text-[#f45970]" />
                        </div>
                        <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
                            NOT AUTHORIZED
                        </CardTitle>
                        <CardDescription className="text-gray-500 text-base">
                            Access to this page restricted for authorized users.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="text-center px-6">
                        <p className="text-sm sm:text-base text-gray-600">
                            To participate in voting and access all features, please connect your crypto wallet.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default NotAuthorized