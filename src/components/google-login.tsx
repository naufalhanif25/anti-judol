import { useGoogleLogin } from "@react-oauth/google";
import { GoogleIcon } from "./icons";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { MoonLoader } from "react-spinners";
import { ChevronDown } from "lucide-react";
import { PrivacyPolicy } from "./privacy-policy";
import { TermsOfService } from "./terms-of-service";
import { Popup } from "./popup";

type UserData = {
    email: string;
    name: string;
    picture: string;
};

type UserInfoResponse = {
    data: UserData;
};

export const GoogleLoginButton = ({ className }: { className?: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
    const [termsOfServiceOpen, setTermsOfServiceOpen] = useState(false);
    const [isAgree, setIsAgree] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);

    const handleLogin = useGoogleLogin({
        onSuccess: async (googleToken) => {
            setIsLoading(true);
            setOpenPopup(false);

            try {
                const response: UserInfoResponse = await axios.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${googleToken.access_token}`,
                        },
                    }
                );

                localStorage.setItem("user_name", response.data.name);
                localStorage.setItem("user_picture", response.data.picture);
            } catch (error) {
                const axiosError = error as AxiosError;

                console.error(axiosError.message);
            }

            localStorage.setItem("google_token", googleToken.access_token);

            setIsLoading(false);

            window.location.reload();
        },
        onError: () => {
            console.error("Failed to sign in with Google account");
        },
        scope: "https://www.googleapis.com/auth/youtube.force-ssl",
        flow: "implicit",
    });

    const handlePrivacyPolicyOpen = () => {
        if (privacyPolicyOpen) setPrivacyPolicyOpen(false);
        else setPrivacyPolicyOpen(true);
    };

    const handleTermsOfServiceOpen = () => {
        if (termsOfServiceOpen) setTermsOfServiceOpen(false);
        else setTermsOfServiceOpen(true);
    };

    const handleAgreeButtonClick = () => {
        if (isAgree) setIsAgree(false);
        else setIsAgree(true);
    };

    return (
        <>
            {isLoading ? (
                <button className={className}>
                    <MoonLoader size={16} />
                    Masuk
                </button>
            ) : (
                <>
                    {openPopup && (
                        <Popup className="px-8 py-6 w-full mx-[6%] md:w-128 h-fit bg-gray-100 border-gray-200 border-2 rounded-xl flex flex-col items-center justify-center gap-6">
                            <h1 className="font-medium text-xl">
                                Persetujuan Pengguna
                            </h1>
                            <span className="gap-2 w-full h-full flex flex-col items-center justify-center">
                                <span
                                    className={`${
                                        privacyPolicyOpen ? "gap-2" : "gap-0"
                                    } transition-[gap] duration-250 ease-out flex flex-col items-center justify-center w-full h-fit`}
                                >
                                    <button
                                        onClick={handlePrivacyPolicyOpen}
                                        className="w-full text-left bg-gray-200 p-4 gap-4 rounded-md flex items-center justify-between cursor-pointer"
                                    >
                                        Kebijakan Privasi (Privacy Policy)
                                        <ChevronDown
                                            strokeWidth={1.6}
                                            className={`${
                                                privacyPolicyOpen
                                                    ? "-rotate-z-180"
                                                    : "rotate-z-0"
                                            } transition duration-250 ease-out`}
                                        />
                                    </button>
                                    <PrivacyPolicy
                                        className={`w-full ${
                                            privacyPolicyOpen
                                                ? "h-48 py-4 opacity-100"
                                                : "h-0 py-0 opacity-0"
                                        } transition-[height padding-bottom padding-top opacity] duration-250 ease-out px-4 border-gray-200 border-2 rounded-md overflow-y-auto overflow-x-hidden text-md text-justify`}
                                    />
                                </span>
                                <span
                                    className={`${
                                        termsOfServiceOpen ? "gap-2" : "gap-0"
                                    } transition-[gap] duration-250 ease-out flex flex-col items-center justify-center w-full h-fit`}
                                >
                                    <button
                                        onClick={handleTermsOfServiceOpen}
                                        className="w-full text-left bg-gray-200 p-4 gap-4 rounded-md flex items-center justify-between cursor-pointer"
                                    >
                                        Syarat & Ketentuan Layanan (Terms of
                                        Service)
                                        <ChevronDown
                                            strokeWidth={1.6}
                                            className={`${
                                                termsOfServiceOpen
                                                    ? "-rotate-z-180"
                                                    : "rotate-z-0"
                                            } transition duration-250 ease-out`}
                                        />
                                    </button>
                                    <TermsOfService
                                        className={`w-full ${
                                            termsOfServiceOpen
                                                ? "h-48 py-4 opacity-100"
                                                : "h-0 py-0 opacity-0"
                                        } transition-[height padding-bottom padding-top opacity] duration-250 ease-out px-4 border-gray-200 border-2 rounded-md overflow-y-auto overflow-x-hidden text-md text-justify`}
                                    />
                                </span>
                            </span>
                            <span className="w-full flex items-center justfy-start gap-4">
                                <span
                                    onClick={handleAgreeButtonClick}
                                    className="size-5 flex-shrink-0 border-gray-400 border-1 rounded-sm cursor-pointer p-0.5 flex items-center justify-center"
                                >
                                    {isAgree && (
                                        <span className="size-full bg-green-400 rounded-xs"></span>
                                    )}
                                </span>
                                <p className="text-sm text-gray-600">
                                    Saya setuju dengan Kebijakan Privasi serta
                                    Syarat & Ketentuan yang berlaku
                                </p>
                            </span>
                            <span className="w-full flex items-center justfy-start gap-4">
                                <button
                                    onClick={
                                        isAgree ? () => handleLogin() : () => {}
                                    }
                                    className={`flex-1 text-center py-2 ${
                                        isAgree
                                            ? "bg-green-500 hover:bg-green-400 text-green-50 transition duration-100 ease-out cursor-pointer"
                                            : "bg-green-400 text-green-200"
                                    } rounded-md`}
                                >
                                    Ya
                                </button>
                                <button
                                    onClick={() => setOpenPopup(false)}
                                    className="flex-1 text-center text-red-100 py-2 bg-red-500 hover:bg-red-400 transition duration-100 ease-out cursor-pointer rounded-md"
                                >
                                    Tidak
                                </button>
                            </span>
                        </Popup>
                    )}
                    <button
                        onClick={() => setOpenPopup(true)}
                        className={className}
                    >
                        <GoogleIcon width={20} height={20} />
                        Masuk
                    </button>
                </>
            )}
        </>
    );
};
