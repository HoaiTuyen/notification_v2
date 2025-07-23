import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="py-10 bg-white font-serif">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div
            className="w-full h-[400px] bg-center bg-no-repeat bg-cover flex items-center justify-center"
            style={{
              backgroundImage:
                "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
            }}
          >
            <h1 className="text-[80px] font-bold">404</h1>
          </div>

          <div className="mt-[50px]">
            <h2 className="text-2xl font-bold mb-2">Có vẻ bạn đang bị lạc</h2>
            <p className="text-gray-600 mb-6">
              Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa!
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
