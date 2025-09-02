import {
  Button,
  LoadingOverlay,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  ACCOUNT_ROUTES,
  DASHBOARD_ROUTES,
} from "../../utilities/constants/routes";
import { useLoginAccountMutation } from "../../redux/endpoints/accountEndpoints";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../redux/reducer/authReducer";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [visible, { toggle }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [loginAccount] = useLoginAccountMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmitForm = async (data) => {
    try {
      if (data) {
        setLoading(true);
        const response = await loginAccount(data).unwrap();
        if (response?.status === "SUCCESS") {
          const { fname, lname, email, userId, accessLevel } = response?.result;
          dispatch(
            setAuthUser({
              fname: fname,
              lname: lname,
              email: email,
              userId: userId,
              accessLevel: accessLevel,
            })
          );
          navigate(DASHBOARD_ROUTES.DASHBOARD);
        }
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <main>
      <section className="w-[400px] h-[450px] rounded-2xl shadow-2xl bg-secondary">
        <div>
          <LoadingOverlay
            visible={loading}
            loaderProps={{ color: "#0e3557", type: "oval", size: "lg" }}
          />
        </div>
        <div className="px-10 py-10">
          <Text size="xl" fw={300} c="#0e3557">
            Login
          </Text>
          <Text size="xs" fw={300} c="#0e3557">
            Use your active and verified credentials.
          </Text>
        </div>
        <form onSubmit={handleSubmit(onSubmitForm)} className="px-10 my-2">
          <TextInput
            label="Email"
            labelProps={{ fw: 300 }}
            placeholder="you@example.com"
            {...register("email")}
            autoComplete={false}
            required
            className="pb-2"
          />
          <PasswordInput
            label="Password"
            labelProps={{ fw: 300 }}
            placeholder="Password"
            visible={visible}
            onVisibilityChange={toggle}
            {...register("password")}
            autoComplete={false}
            required
            className="pb-10"
          />
          <div className="flex justify-center items-center pb-2">
            <Button
              loading={loading}
              loaderProps={{ type: "dots" }}
              type="submit"
              color="#0e3557"
              size="md"
              radius="sm"
              fw={300}
              className="px-2 my-2 cursor-pointer"
              onClick={() => {}}
            >
              Log in now
            </Button>
          </div>
          <Text size="sm" fw={300} c="#0e3557" ta={"center"}>
            Don't have an account yet?{" "}
            <span
              className="underline underline-offset-2 text-blue-500 cursor-pointer"
              onClick={() => {
                navigate(ACCOUNT_ROUTES.REGISTER);
              }}
            >
              Register here
            </span>
          </Text>
        </form>
      </section>
    </main>
  );
};

export default Login;
