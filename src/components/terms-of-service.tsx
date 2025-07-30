import * as CustomList from "./custom-list";

export const TermsOfService = ({ className }: { className: string }) => {
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
                <CustomList.Paragraph
                    title="Deskripsi Layanan"
                    paragraph="Anti Judol adalah layanan berbasis web yang memungkinkan pengguna mendeteksi dan menghapus komentar yang terindikasi sebagai judi online di kolom komentar video YouTube milik mereka, menggunakan API resmi dari Google dan YouTube."
                />
                <CustomList.Point
                    title="Akses dan Penggunaan"
                    list={[
                        "Anda harus masuk menggunakan akun Google untuk menggunakan layanan kami.",
                        "Anda hanya diperbolehkan menghapus komentar dari video milik channel Anda sendiri.",
                        "Penggunaan layanan ini terbatas pada tujuan legal dan etis, terutama untuk melawan spam dan konten berbahaya.",
                    ]}
                />
                <CustomList.Point
                    title="Batasan Tanggung Jawab"
                    list={[
                        "Kami tidak bertanggung jawab atas kesalahan yang disebabkan oleh perubahan pada API YouTube atau OAuth Google.",
                        "Kami tidak menjamin 100% deteksi komentar judi online karena bergantung pada pola dan filter yang tersedia.",
                    ]}
                />
                <CustomList.Paragraph
                    title="Perubahan Layanan"
                    paragraph="Kami berhak melakukan perubahan atau penghentian layanan tanpa pemberitahuan sebelumnya, termasuk pembaruan kebijakan privasi dan syarat penggunaan."
                />
                <CustomList.Paragraph
                    title="Penghentian Akses"
                    paragraph="Kami berhak untuk menangguhkan atau menghentikan akses Anda ke layanan jika terindikasi adanya penyalahgunaan."
                />
                <CustomList.Paragraph
                    title="Hak Kekayaan Intelektual"
                    paragraph="Seluruh konten, logo, dan antarmuka pengguna dari Anti Judol adalah milik kami dan dilindungi oleh hukum hak cipta."
                />
                <CustomList.Paragraph
                    title="Hukum yang Berlaku"
                    paragraph="Layanan ini tunduk pada hukum yang berlaku di Republik Indonesia. Perselisihan yang timbul akan diselesaikan melalui jalur hukum yang sah di wilayah hukum Indonesia."
                />
            </ol>
        </span>
    );
};
