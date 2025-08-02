import * as CustomList from "./custom-list";

export const AboutUs = ({ className }: { className: string }) => {
    return (
        <span className={className}>
            <p>
                Anti Judol dibuat berdasarkan permasalahan nyata yang sering
                ditemui ketika menonton video YouTube, dimana komentar spam dan
                iklan judol sering kali meresahkan dan mengganggu kenyamanan
                pengguna lain. Layanan ini gratis dan open source dengan lisensi
                BSD 3-Clause.
            </p>
            <br />
            <p>
                Jika Anda memiliki kendala, saran, atau kritikan, silahkan
                hubungi Kami melalui kontak berikut ini:
            </p>
            <CustomList.Point
                className="font-normal list-disc ml-4"
                list={[
                    <p>
                        Gmail:{" "}
                        <a
                            href="mailto:falhnf25@gmail.com"
                            target="_blank"
                            className="text-blue-500 hover:text-blue-400 hover:underline transition duration-100 ease-out truncate"
                        >
                            falhnf25@gmail.com
                        </a>
                    </p>,
                    <p>
                        WhatsApp:{" "}
                        <a
                            href="https://api.whatsapp.com/send?phone=6285180554208"
                            target="_blank"
                            className="text-blue-500 hover:text-blue-400 hover:underline transition duration-100 ease-out truncate"
                        >
                            085180554208
                        </a>
                    </p>,
                    <p>
                        GitHub Repo:{" "}
                        <a
                            href="https://github.com/naufalhanif25/anti-judol.git"
                            target="_blank"
                            className="text-blue-500 hover:text-blue-400 hover:underline transition duration-100 ease-out truncate"
                        >
                            anti-judol
                        </a>
                    </p>,
                ]}
            />
        </span>
    );
};
