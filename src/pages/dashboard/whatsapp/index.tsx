/* eslint-disable tailwindcss/no-custom-classname */
import { useTranslation } from "react-i18next";
import TitleSection from "../../../components/title";
import BgCard from "../../../components/cards/bg";
import { Button, TextInput } from "flowbite-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import axiosDefault from "../../../utilities/axios";
import { API_WHATSAPP } from "../../../router/routes/apiRoutes";
import { toastifyBox } from "../../../helper/toastifyBox";
import axios from "axios";

export default function Whatsapp() {
  const [phone_number, setPhoneNumber] = useState<string>("");
  const { t } = useTranslation("whatsapp");

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    // /^[0-9+\-() ]*$/.test(value) && value.length <= 11 && setPhoneNumber(value);
    /^[0-9]*$/.test(value) && value.length <= 11 && setPhoneNumber(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await axiosDefault.post(API_WHATSAPP.updateNumber, {
        _method: "put",
        phone_number,
      });
      toastifyBox("success", data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toastifyBox("error", error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        toastifyBox("error", error.message);
      } else {
        toastifyBox("error", "Couldn't update phone number!");
      }
    }
  };

  // const fetchNumber = async () => {
  //   const { data } = await axiosDefault.get(API_WHATSAPP.getNumber);
  //   console.log(data);
  // };

  // useEffect(() => {
  //   fetchNumber();
  // }, []);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap justify-between gap-4">
        <TitleSection title={t("whatsapp")} />
      </div>

      <BgCard>
        <form
          className="flex min-h-[400px] flex-col items-center justify-center gap-4"
          onSubmit={(event) => handleSubmit(event)}
        >
          <label
            htmlFor="whats-num"
            className="w-fit rounded-full border-0 bg-[#0DBB41]"
          >
            <i className="fi fi-brands-whatsapp grid  fill-[#0DBB41] p-4 text-5xl text-white" />
          </label>
          <TextInput
            id="whats-num"
            type="text"
            name="number"
            className="w-72"
            value={phone_number}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
          <Button type="submit" disabled={phone_number.length !== 11}>
            {t("editNumber")}
          </Button>
        </form>
      </BgCard>
    </div>
  );
}
