import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import toast from "react-hot-toast";

const Register = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const role = form.role.value;
    const phone = form.phone.value;
    const password = form.password.value;
    console.log(name, role, email, phone, password);

    const userInfo = {
      name,
      role,
      phone,
      password,
      email,
    };
    axiosPublic
      .post("/users", userInfo)
      .then((res) => {
        console.log(res.data);

        toast.success("User registered successfully");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error("User was not registered");
      });
  };

  return (
    <div className="bg-[#FEFCFB]">
      <div className="max-w-[1400px] px-2 mx-auto mt-[40px] mb-[40px]">
        <div className="hero">
          <div className="flex-col md:flex-row-reverse hero-content">
            <div className="max-w-[280px] lg:max-w-[400px]">
              <img src="" alt="" />
            </div>
            <div className="border-2 shadow-xl max-w-[280px] md:max-w-[400px] shrink border-yellow-500 card">
              <form onSubmit={handleSubmit} className="card-body">
                <div className="form-control">
                  <input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <select
                    name="role"
                    className="w-full max-w-xs select input-bordered"
                    defaultValue="" // Use defaultValue to set the default value
                  >
                    <option disabled value="">
                      Role
                    </option>
                    <option value="owner">House Owner</option>
                    <option value="renter">Renter</option>
                  </select>
                </div>
                <div className="form-control">
                  <input
                    name="phone"
                    type="phone"
                    placeholder="Phone Number"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your Password"
                      className="w-full input input-bordered"
                      required
                    />
                    {showPassword ? (
                      <AiOutlineEyeInvisible
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                        className="absolute text-2xl top-3 right-3"
                      ></AiOutlineEyeInvisible>
                    ) : (
                      <AiOutlineEye
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                        className="absolute text-2xl top-3 right-3"
                      ></AiOutlineEye>
                    )}
                  </div>
                </div>
                <div className="mt-6 form-control">
                  <input
                    className="bg-yellow-500  hover:opacity-90 text-white text-3xl h-[60px] px-[20px] rounded-lg"
                    type="submit"
                    value="Register"
                  />
                  <p className="mt-4 font-medium text-center text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login">
                      <span className="text-blue-700">Login</span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
