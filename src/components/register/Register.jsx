import {
  Text,
  NativeSelect,
  TextInput,
  Stepper,
  Group,
  Button,
  PinInput,
  PasswordInput,
  LoadingOverlay,
  Loader,
} from "@mantine/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { isNullOrUndefinedOrEmpty } from "../../utilities/utilities";
import { useDispatch } from "react-redux";
import {
  register as registerAccount,
  credentials as registerCredential,
} from "../../redux/reducer/accountReducer";
import {
  useGetTitlesQuery,
  useGetDesignationQuery,
} from "../../redux/endpoints/commonCodesEndpoint";
import {
  useRegisterUserMutation,
  useValidateEmailMutation,
} from "../../redux/endpoints/accountEndpoints";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_ROUTES } from "../../utilities/constants/routes";
import { StatusCodes } from "http-status-codes";

const Register = () => {
  const { register, handleSubmit, getValues } = useForm();
  const [selectedId, setSelectedId] = useState("");
  const [disableNext, setDisableNext] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [active, setActive] = useState(0);
  const [otpValue, setOtpValue] = useState("");
  const [lockCredEntry, setLockCredEntry] = useState(false);
  const [isEmailVerified, setEmailVerified] = useState(false);
  const [loadingNextBtn, setLoadingNextBtn] = useState(false);
  const [detailsSent, setDetailsSent] = useState(false);
  const {
    isFetching,
    isLoading,
    isSuccess,
    data: titleList = [],
  } = useGetTitlesQuery();
  const { data: designationList = [] } = useGetDesignationQuery();
  const [registerUser] = useRegisterUserMutation();
  const [validateEmail] = useValidateEmailMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const titles = titleList?.result || [];
  const designation = designationList?.result || [];

  const nextStep = () => {
    let next = 0;
    setActive((current) => {
      if (current === 2 && !isEmailVerified) {
        setLoadingNextBtn(true);
        next = current;
      } else {
        next = current < 3 ? current + 1 : current;
      }

      if (next === 1) {
        const registerFormData = getValues();
        dispatch(
          registerAccount({
            id: registerFormData.officeId,
            title: selectedId,
            firstName: registerFormData.firstname,
            lastName: registerFormData.lastname,
            designation: selectedDesignation,
          })
        );
      }

      if (next === 2 && !detailsSent) {
        const credentialFormData = getValues();
        dispatch(
          registerCredential({
            email: credentialFormData.email,
            password: credentialFormData.password,
          })
        );
        handleSubmit(onSubmitRegisterForm)();
        setDetailsSent(true);
      }

      // Step 3: Only allow if email is verified
      if (next === 3) {
        setLockCredEntry(true);
        setDisableNext(true);
      }

      return next;
    });
  };

  const prevStep = () => {
    setLoadingNextBtn(false);
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const onSubmitRegisterForm = async (data) => {
    try {
      const payload = {
        user_id: data.officeId,
        title: selectedId,
        first_name: data.firstname,
        last_name: data.lastname,
        suffix: "",
        designation: selectedDesignation,
        email: data.email,
        password: data.password,
      };

      const response = await registerUser(payload).unwrap();
    } catch (error) {}
  };

  const handleSendOTP = async () => {
    const payload = { otp: otpValue };
    try {
      await validateEmail(payload).unwrap();
      setEmailVerified(true);
      setLoadingNextBtn(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text:
          error?.data?.message ||
          "Invalid OTP or failed to verify. Please try again.",
      });
    }
  };

  const details = () => {
    return (
      <section className="w-[600px] h-[400px] px-10">
        <div className="py-5">
          <Text size="xl" fw={300} c="#0e3557">
            User information details
          </Text>
        </div>

        {/* Office ID */}
        <div className="w-full mb-2">
          <TextInput
            id="register-issuedId-field-id"
            label="Office Id/Dept. Id"
            labelProps={{ fw: 300 }}
            placeholder="ID"
            required
            c={"#0e3557"}
            {...register("officeId")}
            autoComplete={false}
          />
        </div>

        {/* Title */}
        <div className="w-full mb-2">
          <NativeSelect
            id="register-title-options-id"
            label="Prefix"
            labelProps={{ fw: 300 }}
            data={[
              { label: "Select", value: "" },
              ...titles.map((item) => ({
                label: item.value,
                value: item.id.toString(),
              })),
            ]}
            dro
            value={selectedId}
            onChange={(event) => {
              if (!isNullOrUndefinedOrEmpty(event.currentTarget.value)) {
                setSelectedId(event.currentTarget.value);
              }
            }}
            required
            styles={{
              label: {
                color: "#0e3557", // text color
              },
            }}
          />
        </div>

        {/* Firstname and Lastname */}
        <div className="flex gap-4 mb-2">
          <TextInput
            id="register-firstname-field-id"
            label="Firstname"
            labelProps={{ fw: 300 }}
            placeholder="Firstname"
            required
            className="w-1/2"
            c={"#0e3557"}
            {...register("firstname")}
          />
          <TextInput
            id="register-lastname-field-id"
            label="Lastname"
            labelProps={{ fw: 300 }}
            placeholder="Lastname"
            required
            className="w-1/2"
            c={"#0e3557"}
            {...register("lastname")}
          />
        </div>

        {/* Designation */}
        <div className="w-full">
          <NativeSelect
            id="register-designation-options-id"
            label="Designation"
            labelProps={{ fw: 300 }}
            data={[
              { label: "Select", value: "" },
              ...designation.map((item) => ({
                label: item.value,
                value: item.id.toString(),
              })),
            ]}
            value={selectedDesignation}
            onChange={(event) => {
              if (!isNullOrUndefinedOrEmpty(event.currentTarget.value)) {
                setSelectedDesignation(event.currentTarget.value);
              }
            }}
            required
            styles={{
              label: {
                color: "#0e3557", // text color
              },
            }}
          />
        </div>
      </section>
    );
  };

  const loginCredentials = () => {
    return (
      <section>
        <div className="w-[600px] h-[400px]">
          <div className="px-10 py-5">
            <div className="py-5">
              <Text size="xl" fw={300} c="#0e3557">
                User login credential
              </Text>
            </div>
            <TextInput
              id="register-email-address-id"
              label="Email"
              labelProps={{ fw: 300 }}
              placeholder="sample@mail.com"
              {...register("email")}
              required
              c={"#0e3557"}
              className="mb-2"
            />
            <PasswordInput
              id="register-password-id"
              label="Password"
              labelProps={{ fw: 300 }}
              placeholder="Password"
              {...register("password")}
              required
              c={"#0e3557"}
              className="mb-2"
            />
            <PasswordInput
              id="register-retype-password-id"
              label="Re-type password"
              labelProps={{ fw: 300 }}
              placeholder="Password"
              {...register("retypePassword")}
              required
              c={"#0e3557"}
              className="mb-2"
            />
          </div>
        </div>
      </section>
    );
  };

  const verifyEmailAccount = () => {
    return (
      <section className="w-[600px] h-[400px]">
        <div className="min-h-full flex flex-col gap-1 justify-center items-center">
          <Text
            tt="none"
            ta="center"
            px={60}
            py={20}
            fw={300}
            size="lg"
            c={"#0e3557"}
          >
            Your OTP was sent to your email address. Please verify the account
            using the OTP provided.
          </Text>
          <PinInput
            size="xl"
            length={6}
            type="number"
            oneTimeCode
            inputMode="numeric"
            value={otpValue}
            onChange={(val) => setOtpValue(val)}
            disabled={isEmailVerified}
            py={20}
          />
          <Button
            onClick={!isEmailVerified && handleSendOTP}
            color="#0e3557"
            size="md"
            radius="sm"
            fw={300}
          >
            {!isEmailVerified ? "Verify email" : "OTP validated"}
          </Button>
        </div>
      </section>
    );
  };

  const completionPage = () => {
    return (
      <section>
        <div className="w-[600px] h-[400px]">
          <div className="w-full h-full flex justify-center items-center">
            <Text size="xl" fw={80} c={"#0e3557"}>
              Account has been created and verified.
            </Text>
          </div>
        </div>
      </section>
    );
  };

  return (
    <main>
      <section className="min-h-[400px] w-[800px] pt-16 pb-10 my-10 flex justify-center items-center bg-secondary rounded-2xl shadow-2xl">
        <LoadingOverlay
          visible={isLoading || isFetching}
          loaderProps={{ color: "#0e3557", type: "oval", size: "lg" }}
        />
        <div>
          <Stepper
            color="#0e3557"
            size="sm"
            iconSize={32}
            active={active}
            onStepClick={setActive}
          >
            <Stepper.Step
              label="Details"
              description="User details"
              c={"#0e3557"}
            >
              {details()}
            </Stepper.Step>
            <Stepper.Step
              label="Credential"
              description="Login credential"
              c={"#0e3557"}
            >
              {loginCredentials()}
            </Stepper.Step>
            <Stepper.Step
              label="Verification"
              description="One-Time PIN"
              c={"#0e3557"}
            >
              {verifyEmailAccount()}
            </Stepper.Step>
            <Stepper.Completed>{completionPage()}</Stepper.Completed>
          </Stepper>
          {!disableNext && (
            <Group justify="center" mt="xl">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={lockCredEntry}
                color="#0e3557"
                size="md"
                radius="sm"
                fw={300}
              >
                Back
              </Button>
              <Button
                onClick={nextStep}
                color="#0e3557"
                size="md"
                radius="sm"
                fw={300}
                loading={loadingNextBtn}
                loaderProps={{ type: "dots" }}
              >
                Next step
              </Button>
            </Group>
          )}
          {!disableNext && (
            <div className="text-center my-5">
              <Text size="sm" c="#0e3557" fw={300}>
                Already had an account?{" "}
                <span
                  className="underline underline-offset-2 text-blue-500 cursor-pointer"
                  onClick={() => {
                    navigate(ACCOUNT_ROUTES.LOGIN);
                  }}
                >
                  Login here
                </span>
              </Text>
            </div>
          )}
          {disableNext && (
            <div className="flex justify-center items-center">
              <Button
                onClick={() => {
                  navigate(ACCOUNT_ROUTES.LOGIN);
                }}
                color="#0e3557"
                size="md"
                radius="sm"
                fw={300}
              >
                Login here
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Register;
