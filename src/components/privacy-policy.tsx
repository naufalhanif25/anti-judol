import * as CustomList from "./custom-list";

export const PrivacyPolicy = ({ className }: { className: string }) => {
    return (
        <span className={className}>
            <strong className="font-medium">
                Terakhir diperbarui: 30 Juli 2025
            </strong>
            <br />
            <br />
            Dengan menggunakan situs web Anti Judol, Anda menyetujui syarat dan
            ketentuan berikut:
            <br />
            <br />
            <ol className="list-decimal ml-4">
                <CustomList.Point
                    title="Informasi yang Kami Kumpulkan"
                    intro="Kami mengumpulkan informasi berikut saat Anda menggunakan Anti Judol:"
                    list={[
                        "Informasi Akun Google: Nama, alamat email, dan foto profil Anda melalui proses otentikasi Google OAuth.",
                        "Token Akses: Kami menyimpan session token secara temporer untuk mengakses data pengguna selama sesi aktif.",
                        "Data Video dan Komentar YouTube: Kami mengakses data video, komentar, dan informasi channel yang relevan menggunakan YouTube Data API v3.",
                    ]}
                />
                <CustomList.Point
                    title="Cara Kami Menggunakan Informasi Anda"
                    intro="Informasi yang kami kumpulkan digunakan untuk:"
                    list={[
                        "Menampilkan data pengguna di antarmuka aplikasi.",
                        "Memverifikasi kepemilikan channel YouTube untuk memastikan hanya pemilik sah yang dapat menghapus komentar dari video mereka.",
                        "Menyediakan antarmuka untuk mendeteksi dan menghapus komentar yang terindikasi sebagai spam atau promosi judi online.",
                    ]}
                />
                <CustomList.Point
                    title="Penyimpanan dan Keamanan Data"
                    list={[
                        "Kami tidak menyimpan data video, komentar, atau data pribadi pengguna secara permanen.",
                        "Token sesi hanya berlaku selama sesi aktif pengguna dan akan dihapus secara otomatis setelah sesi berakhir atau logout.",
                        "Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi data Anda dari akses yang tidak sah.",
                    ]}
                />
                <CustomList.Paragraph
                    title="Berbagi Informasi"
                    paragraph="Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga."
                />
                <CustomList.Point
                    title="Hak Anda"
                    intro="Anda dapat:"
                    list={[
                        "Memutus akses akun Google Anda kapan saja.",
                        "Meminta penghapusan data sesi Anda.",
                        "Menghubungi kami untuk pertanyaan lebih lanjut terkait privasi.",
                    ]}
                />
                <CustomList.Paragraph
                    title="Kepatuhan terhadap Kebijakan Google"
                    paragraph="Anti Judol sepenuhnya mematuhi kebijakan Google API Services User Data Policy, termasuk prinsip penggunaan data yang minimal dan hanya untuk tujuan yang disebutkan di atas."
                />
            </ol>
        </span>
    );
};
