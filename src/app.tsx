import { useEffect, useRef, useState } from "react";
import { Trash2, Search, Link, KeyIcon } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ClipLoader, PulseLoader } from "react-spinners";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLoginButton } from "./components/google-login";
import { Popup } from "./components/popup";

type YTVideoComment = {
    id: string;
    text: string;
    author: string;
    authorProfileImage: string;
};

type YTVideoCommentRaw = {
    snippet: {
        topLevelComment: {
            id: string;
            snippet: {
                textOriginal: string;
                authorDisplayName: string;
                authorProfileImageUrl: string;
            };
        };
    };
};

type YTVideoCommentResponse = {
    data: {
        nextPageToken: string;
        items: YTVideoCommentRaw[];
    };
};

type YTChannelData = {
    id: string;
    name: string;
    title: string;
    thumbnail: string;
};

const getVideoId = (videoUrl: string) => {
    try {
        const url = new URL(videoUrl);
        const vParam = url.searchParams.get("v");
        const pathArr = url.pathname.split("/");

        if (vParam) return vParam;
        else return pathArr.pop();
    } catch {
        return null;
    }
};

const isJudolComment = (comment: string) => {
    const normalRegex =
        /^[\u0000-\u00BF\u00D7\u00F7\u01C0-\u01C3\u02B0-\u03FF\u2000-\u209F]+$/u;
    const cleanComment = comment
        .replace(/\p{Emoji}/gu, "")
        .replace(/\p{Emoji_Presentation}/gu, "")
        .replace(/\p{Extended_Pictographic}/gu, "");

    return !normalRegex.test(cleanComment);
};

const isKeywordMatch = (comment: string, keywords: string) => {
    const keywordArr = keywords.toLowerCase().replace(" ", "").split(",");

    for (const keyword of keywordArr) {
        if (comment.toLocaleLowerCase().includes(keyword)) return true;
    }

    return false;
};

export default function App() {
    const textInputRef = useRef<HTMLInputElement>(null);
    const keywordInputRef = useRef<HTMLInputElement>(null);
    const [isInputFilledIn, setIsInputFilledIn] = useState(false);
    const [channelData, setChannelData] = useState<YTChannelData | null>();
    const [commentArray, setCommentArray] = useState<YTVideoComment[]>([]);
    const [commnetsStatus, setCommentsStatus] = useState<boolean[]>([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [totalSelected, setTotalSelected] = useState(0);
    const [openAlertPopup, setOpenAlertPopup] = useState(false);
    const [errorMassage, setErrorMessage] = useState("");
    const googleToken = localStorage.getItem("google_token");
    const userData = {
        name: localStorage.getItem("user_name"),
        picture: localStorage.getItem("user_picture"),
    };

    const openBrowser = async () => {
        setChannelData(null);
        setCommentArray([]);
        setIsSearching(true);

        if (textInputRef.current?.value) {
            const apiKey = import.meta.env.VITE_API_KEY;
            const baseUrl = import.meta.env.VITE_API_URI;
            const videoUrl = textInputRef.current.value;
            const videoId = getVideoId(videoUrl);

            if (!videoId) {
                setIsSearching(false);

                return;
            }

            try {
                const videoResponse = await axios.get(`${baseUrl}/videos`, {
                    params: {
                        part: "snippet,statistics,contentDetails",
                        id: videoId,
                        key: apiKey,
                    },
                });
                const videoDataItem = videoResponse.data.items[0];

                const allComments: YTVideoCommentRaw[] = [];
                let nextPageToken = null;

                do {
                    const commentsResponse: YTVideoCommentResponse =
                        await axios.get(`${baseUrl}/commentThreads`, {
                            params: {
                                part: "snippet",
                                maxResults: 100,
                                videoId: videoId,
                                key: apiKey,
                                pageToken: nextPageToken,
                            },
                        });
                    const commentsDataItems: YTVideoCommentRaw[] =
                        commentsResponse.data.items || [];

                    for (const commentItem of commentsDataItems) {
                        allComments.push(commentItem);
                    }

                    nextPageToken = commentsResponse.data.nextPageToken;
                } while (nextPageToken);

                if (videoDataItem) {
                    setChannelData({
                        id: videoDataItem.snippet.channelId || "",
                        title: videoDataItem.snippet.title || "",
                        name: videoDataItem.snippet.channelTitle || "",
                        thumbnail:
                            videoDataItem.snippet.thumbnails.default.url || "",
                    });
                }

                if (allComments) {
                    const keyword = keywordInputRef.current?.value;

                    const clearComments = allComments.filter(
                        (comment) =>
                            isJudolComment(
                                comment.snippet.topLevelComment.snippet
                                    .textOriginal
                            ) ||
                            (keyword
                                ? isKeywordMatch(
                                      comment.snippet.topLevelComment.snippet
                                          .textOriginal,
                                      keyword
                                  )
                                : false)
                    );

                    const newComments = clearComments.map((comment) => ({
                        id: comment.snippet.topLevelComment.id,
                        text: comment.snippet.topLevelComment.snippet
                            .textOriginal,
                        author: comment.snippet.topLevelComment.snippet
                            .authorDisplayName,
                        authorProfileImage:
                            comment.snippet.topLevelComment.snippet
                                .authorProfileImageUrl,
                    }));
                    const newCommentsStatus = Array.from(
                        { length: newComments.length },
                        () => true
                    );

                    setCommentArray(newComments);
                    setCommentsStatus(newCommentsStatus);
                    setTotalSelected(newCommentsStatus.length);
                }
            } catch (error) {
                const axiosError = error as AxiosError;

                console.error(axiosError);

                setAlertMessage(
                    "Terjadi kesalahan. Pastikan URL valid dan koneksi internet stabil"
                );
            }
        }

        setIsSearching(false);
    };

    const setActive = (index: number) => {
        setCommentsStatus((status) => {
            const newStatus = [...status];

            newStatus[index] = !newStatus[index];

            const newTotalSelected = newStatus.filter((status) => status);

            setTotalSelected(newTotalSelected.length);

            return newStatus;
        });
    };

    useEffect(() => {
        const textInputElement = textInputRef.current;

        if (textInputElement) {
            const checkIsInputFilledIn = () => {
                if (textInputElement.value) setIsInputFilledIn(true);
                else setIsInputFilledIn(false);
            };

            checkIsInputFilledIn();

            textInputElement.addEventListener("input", checkIsInputFilledIn);

            return () =>
                textInputElement.removeEventListener(
                    "input",
                    checkIsInputFilledIn
                );
        }
    }, [textInputRef, isInputFilledIn]);

    const handleLogout = () => {
        localStorage.removeItem("google_token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_picture");

        window.location.reload();
    };

    const handleCommentsDelete = async () => {
        const baseUrl = import.meta.env.VITE_API_URI;

        setIsLoading(true);

        try {
            const response = await axios.get(`${baseUrl}/channels`, {
                headers: {
                    Authorization: `Bearer ${googleToken}`,
                },
                params: {
                    part: "id,snippet",
                    mine: true,
                },
            });

            const channelId = response.data.items[0].id || "";

            if (channelId !== channelData?.id) {
                setIsLoading(false);
                setErrorMessage(
                    "Akun Anda tidak memiliki akses terhadap channel ini"
                );

                return;
            } else {
                commnetsStatus.forEach(async (status, index) => {
                    if (status) {
                        await axios.delete(
                            "https://www.googleapis.com/youtube/v3/comments",
                            {
                                headers: {
                                    Authorization: `Bearer ${googleToken}`,
                                },
                                params: {
                                    id: commentArray[index].id,
                                },
                            }
                        );
                    }
                });

                const newComments = commentArray.filter(
                    (_, index) => !commnetsStatus[index]
                );
                const newStatus = commnetsStatus.filter((status) => !status);

                setCommentsStatus(newStatus);
                setTotalSelected(newComments.length);
                setCommentArray(newComments);
            }
        } catch (error) {
            const axiosError = error as AxiosError;

            console.error(axiosError.message);

            setErrorMessage(
                "Terjadi kesalahan. Pastikan channel Anda valid dan koneksi internet stabil"
            );
        }

        setIsLoading(false);
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID}>
            <main className="flex items-center justify-center w-screen h-screen px-[6%] lg:px-[12%] py-[6%]">
                {openAlertPopup && (
                    <Popup className="px-10 py-8 bg-gray-100 border-gray-200 border-2 rounded-xl flex flex-col items-center justify-center gap-4">
                        <h1 className="text-center">
                            <strong className="text-gray-800">
                                {userData.name}
                            </strong>
                            , Apakah anda yakin <br /> ingin keluar?
                        </h1>
                        <span className="w-full flex items-center justify-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="flex-1 text-center text-green-100 py-2 bg-green-500 hover:bg-green-400 transition duration-50 ease-out cursor-pointer rounded-md"
                            >
                                Ya
                            </button>
                            <button
                                onClick={() => setOpenAlertPopup(false)}
                                className="flex-1 text-center text-red-100 py-2 bg-red-500 hover:bg-red-400 transition duration-100 ease-out cursor-pointer rounded-md"
                            >
                                Tidak
                            </button>
                        </span>
                    </Popup>
                )}
                <section className="w-full h-full relative rounded-3xl flex items-center justify-center border-gray-200 border-2 overflow-hidden">
                    <div className="flex flex-col items-start lg:items-center justify-center w-full h-full bg-gray-100 p-6 lg:p-8 gap-6 lg:gap-8 overflow-y-auto overflow-x-hidden scroll-smooth">
                        <span className="w-full flex flex-row lg:flex-col items-center justify-between lg:justify-center h-fit gap-2">
                            <h1 className="text-2xl lg:text-3xl font-semibold text-center">
                                Anti Judol
                            </h1>
                            <p className="hidden lg:flex text-md text-gray-800 text-center">
                                Hapus komentar iklan judol pada video YouTube
                            </p>
                            <span className="flex items-center justify-center gap-4 lg:absolute lg:right-0 lg:top-0 lg:p-4">
                                {!googleToken ? (
                                    <GoogleLoginButton className="text-center text-md px-4 lg:px-6 py-2 h-fit lg:h-11 border-gray-400 border-1 z-1 bg-gray-100 hover:bg-gray-200 transition duration-100 ease-out cursor-pointer rounded-md flex items-center justify-center gap-3" />
                                ) : (
                                    <button
                                        onClick={() => setOpenAlertPopup(true)}
                                        className="text-center text-red-500 text-md px-5 lg:px-6 py-2 h-fit lg:h-11 border-red-400 border-1 z-1 bg-red-100 hover:bg-red-200 transition duration-100 ease-out cursor-pointer rounded-md flex items-center justify-center gap-2"
                                    >
                                        Keluar
                                        <span className="size-6 rounded-full border-gray-400 border-1 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={userData.picture || ""}
                                                alt={userData.name || ""}
                                                className="size-full"
                                            />
                                        </span>
                                    </button>
                                )}
                            </span>
                        </span>
                        <span className="w-full h-fit flex flex-col lg:flex-row gap-4 items-end">
                            <span className="grow w-full lg:w-auto h-19 lg:h-20 gap-2 flex flex-col items-start">
                                <h2 className="text-md font-medium flex items-center justify-center gap-1">
                                    URL Video YouTube
                                    <Link
                                        className="stroke-black"
                                        height={18}
                                        strokeWidth={2}
                                    />
                                </h2>
                                <input
                                    ref={textInputRef}
                                    type="text"
                                    className="w-full h-full border-gray-400 border-1 rounded-lg px-3 outline-none"
                                    placeholder="Contoh: https://www.youtube.com/watch?v=jNQXAC9IVRw"
                                />
                            </span>
                            <span className="grow w-full lg:w-auto h-19 lg:h-20 gap-2 flex flex-col items-start">
                                <h2 className="text-md font-medium flex items-center justify-center gap-1">
                                    Kata Kunci (opsional)
                                    <KeyIcon
                                        className="stroke-black"
                                        height={18}
                                        strokeWidth={2}
                                    />
                                </h2>
                                <input
                                    ref={keywordInputRef}
                                    type="text"
                                    className="w-full h-full border-gray-400 border-1 rounded-lg px-3 outline-none"
                                    placeholder="Contoh: slot, gacor, judol"
                                />
                            </span>
                            <button
                                onClick={
                                    isInputFilledIn ? openBrowser : () => {}
                                }
                                className={`${
                                    isInputFilledIn
                                        ? "bg-yellow-400 hover:bg-yellow-300 duration-200 ease-out cursor-pointer"
                                        : "text-yellow-700 bg-yellow-300"
                                } h-11 lg:h-12 text-md px-8 w-full lg:w-fit rounded-lg flex items-center justify-center gap-1`}
                            >
                                Cari
                                <Search
                                    className={`${
                                        isInputFilledIn
                                            ? "stroke-black"
                                            : "stroke-yellow-700"
                                    }`}
                                    height={18}
                                    strokeWidth={1.6}
                                />
                            </button>
                        </span>
                        <span className="w-full grow min-h-30 rounded-xl overflow-hidden items-center justify-center border-gray-300 border-1">
                            <span className="w-full h-full flex flex-col items-center justify-start p-2 gap-2 overflow-y-auto overflow-x-hidden scroll-smooth">
                                {channelData?.title ? (
                                    <>
                                        <span className="w-full bg-gray-200 flex items-center justify-between gap-4 rounded-md p-4">
                                            <span className="flex flex-col w-[50%] md:w-[80%] px-1">
                                                <h2 className="text-lg font-medium text-nowrap truncate">
                                                    {channelData?.title}
                                                </h2>
                                                <p className="text-sm text-nowrap truncate">
                                                    {channelData.name}
                                                </p>
                                            </span>
                                            <span className="h-16 w-24 flex items-center justify-center overflow-hidden rounded-sm border-gray-300 border-1">
                                                <img
                                                    src={
                                                        channelData.thumbnail ||
                                                        "/no-image.jpg"
                                                    }
                                                    alt={channelData?.title}
                                                    className="h-full w-full"
                                                />
                                            </span>
                                        </span>
                                        <span className="w-full grow relative min-h-24 bg-gray-200 overflow-hidden rounded-md flex items-center justify-center">
                                            {isLoading && (
                                                <span className="h-full w-full absolute bottom-0 left-0 bg-gray-200/50"></span>
                                            )}
                                            <span className="w-full h-full flex flex-col items-center gap-2 p-4 overflow-y-auto overflow-x-hidden scroll-smooth">
                                                {commentArray.length !== 0 ? (
                                                    commentArray.map(
                                                        (comment, index) => {
                                                            return (
                                                                <span
                                                                    key={
                                                                        comment.id ||
                                                                        `comment-${index}`
                                                                    }
                                                                    className={`flex w-full items-center p-3 gap-4 transition duration-100 ease-out ${
                                                                        commnetsStatus[
                                                                            index
                                                                        ]
                                                                            ? "border-red-300"
                                                                            : "border-gray-300"
                                                                    } border-1 rounded-sm ${
                                                                        commnetsStatus[
                                                                            index
                                                                        ]
                                                                            ? "bg-red-200"
                                                                            : "bg-gray-200"
                                                                    }`}
                                                                >
                                                                    <span
                                                                        onClick={() =>
                                                                            setActive(
                                                                                index
                                                                            )
                                                                        }
                                                                        className={`size-4 m-1 p-0.5 ${
                                                                            commnetsStatus[
                                                                                index
                                                                            ]
                                                                                ? "border-red-400"
                                                                                : "border-gray-400"
                                                                        } border-1 rounded-sm cursor-pointer flex-shrink-0 flex items-center justify-center`}
                                                                    >
                                                                        {commnetsStatus[
                                                                            index
                                                                        ] && (
                                                                            <span className="size-full rounded-xs bg-red-500"></span>
                                                                        )}
                                                                    </span>
                                                                    <span className="flex flex-col items-start truncate grow">
                                                                        <p className="w-full text-sm text-nowrap truncate text-gray-800">
                                                                            {
                                                                                comment.author
                                                                            }
                                                                        </p>
                                                                        <p className="w-full text-md text-nowrap truncate">
                                                                            {
                                                                                comment.text
                                                                            }
                                                                        </p>
                                                                    </span>
                                                                    <span className="rounded-full size-10 border-gray-400 border-1 flex flex-shrink-0 items-center justify-center overflow-hidden">
                                                                        <img
                                                                            src={
                                                                                comment.authorProfileImage ||
                                                                                "/unknown.jpg"
                                                                            }
                                                                            alt={
                                                                                comment.author
                                                                            }
                                                                            className="size-full"
                                                                        />
                                                                    </span>
                                                                </span>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <span className="w-full h-full p-2 flex items-center justify-center overflow-hidden">
                                                        <p className="text-md text-center text-nowrap text-gray-400">
                                                            Tidak ada komentar
                                                            yang tersedia
                                                        </p>
                                                    </span>
                                                )}
                                            </span>
                                        </span>
                                        <span className="w-full bg-gray-200 flex items-center justify-center gap-4 rounded-md p-4">
                                            <button
                                                onClick={
                                                    googleToken &&
                                                    totalSelected !== 0 &&
                                                    !isLoading
                                                        ? handleCommentsDelete
                                                        : () => {}
                                                }
                                                className={`${
                                                    googleToken &&
                                                    totalSelected !== 0 &&
                                                    !isLoading
                                                        ? "text-white bg-red-500 hover:bg-red-400 duration-200 ease-out cursor-pointer"
                                                        : "text-red-100 bg-red-400"
                                                } text-md py-2 grow lg:w-fit rounded-lg flex items-center justify-center gap-1`}
                                            >
                                                {isLoading
                                                    ? "Menghapus"
                                                    : "Hapus"}{" "}
                                                ({totalSelected})
                                                {isLoading ? (
                                                    <ClipLoader
                                                        size={16}
                                                        color="white"
                                                        className="mx-1"
                                                    />
                                                ) : (
                                                    <Trash2
                                                        className={`${
                                                            googleToken &&
                                                            totalSelected !==
                                                                0 &&
                                                            !isLoading
                                                                ? "stroke-white"
                                                                : "stroke-red-100"
                                                        }`}
                                                        height={18}
                                                        strokeWidth={1.6}
                                                    />
                                                )}
                                            </button>
                                        </span>
                                        {errorMassage && (
                                            <span className="w-full text-red-500 text-sm flex items-center justify-center rounded-md p-1">
                                                {errorMassage}

                                                <>
                                                    {(() => {
                                                        setTimeout(() => {
                                                            setErrorMessage("");
                                                        }, 1000);
                                                    })()}
                                                </>
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {isSearching ? (
                                            <span className="h-full w-full flex flex-col items-center justify-center gap-2">
                                                <p className="text-md text-gray-400">
                                                    Mencari video
                                                </p>
                                                <PulseLoader
                                                    size={6}
                                                    className="dot-loader"
                                                />
                                            </span>
                                        ) : (
                                            <>
                                                <p
                                                    className={`w-full grow flex items-center justify-center text-md ${
                                                        alertMessage
                                                            ? "text-red-400"
                                                            : "text-gray-400"
                                                    } text-center text-nowrap`}
                                                >
                                                    {alertMessage ? (
                                                        <>
                                                            {alertMessage}

                                                            {(() => {
                                                                setTimeout(
                                                                    () => {
                                                                        setAlertMessage(
                                                                            ""
                                                                        );
                                                                    },
                                                                    1000
                                                                );
                                                            })()}
                                                        </>
                                                    ) : (
                                                        "Tidak ada data yang tersedia"
                                                    )}
                                                </p>
                                            </>
                                        )}
                                    </>
                                )}
                            </span>
                        </span>
                    </div>
                </section>
            </main>
        </GoogleOAuthProvider>
    );
}
