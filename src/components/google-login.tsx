import { useGoogleLogin } from "@react-oauth/google";
import { GoogleIcon } from "./icons";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

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

    const handleLogin = useGoogleLogin({
        onSuccess: async (googleToken) => {
            setIsLoading(true);

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

    return (
        <>
            {isLoading ? (
                <button className={className}>
                    <MoonLoader size={16} />
                    Masuk
                </button>
            ) : (
                <button onClick={() => handleLogin()} className={className}>
                    <GoogleIcon width={20} height={20} />
                    Masuk
                </button>
            )}
        </>
    );
};
