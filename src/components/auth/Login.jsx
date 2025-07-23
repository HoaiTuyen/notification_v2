import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../../controller/AuthController";

import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
// import registerPush from "@/config/RegisterPush";
import { Spin } from "antd";
import { toast } from "react-toastify";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const onLogin = async (e) => {
    setLoading(true);
    e.preventDefault();

    const res = await handleLogin(username, password, navigate);

    if (res.status === 200) {
      // await registerPush();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };
  if (loading) {
    return (
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="/img/logo1.png"
          alt="Your Company"
        />
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={onLogin} disabled={loading}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900 text-left"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                type="text"
                value={username}
                placeholder="Username..."
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Mật khẩu
              </label>
            </div>
            <div className="mt-2 flex relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                placeholder="Mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <div
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPass ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
