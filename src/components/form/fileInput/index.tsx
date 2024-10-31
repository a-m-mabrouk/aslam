/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowsRightLeftIcon,
  PhotoIcon,
  TrashIcon,
  TableCellsIcon
} from "@heroicons/react/24/solid";
import styles from "./styles.module.scss";
import { useCallback, useEffect, useState } from "react";
export default function InputFile({
  onChange,
  value,
  label,
  fileType = "photo",
  accept = "png,jpg,jpeg",
  acceptDesc = "PNG, JPG, JPEG",
  btnText = "Add image",
  name,
  error,
}: {
  onChange: any;
  value: File | undefined | string;
  label: string;
  fileType?: "photo" | "excel";
  accept?: string;
  acceptDesc?: string;
  btnText?: string;
  name: string;
  setError?: any;
  error?: string;
}) {
  const [src, setSrc] = useState("");
  const [nameImage, setNameImage] = useState("");

  const toBase64 = (file: File) =>
    new Promise((_, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSrc(reader.result as string);

        setNameImage(file.name);
      };
      reader.onerror = reject;
    });

  const handleChange = (e: any) => {
    const file = e.target.files![0];
    if (fileType === "photo") {
      toBase64(file);
    } else {
      setSrc('excelllll')
      setNameImage(file.name);
    }
    onChange(name, file, true);
  };

  const handleRemove = useCallback(() => {
    setSrc("");
    onChange(name, undefined, false);
  }, [name, onChange]);

  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setSrc(value);
        onChange(name, undefined, false);
      } else toBase64(value);
    }
  }, [name, onChange, value]);

  const handleImgError = useCallback(() => {
    onChange(name, undefined, false);
    setSrc("");
  }, [name, onChange]);
  return (
    <div className="grow">
      <p className={styles.title}>{label}</p>
      {src? (
        <div className={`${styles.file_input_container} ${styles.selected}`}>
          <input
            type="file"
            name={name}
            id={name}
            onChange={handleChange}
            accept={accept}
          />
          {fileType === "photo"? <img src={src} alt="file" onError={handleImgError} />: <TableCellsIcon className="size-32 text-primary" />}
          <div className={styles.info}>
            <p>{nameImage}</p>
            <div className={styles.btn_group}>
              <label htmlFor={name} className={styles.btn}>
                <ArrowsRightLeftIcon className="size-6 text-primary" />
                change
              </label>
              <button className={styles.btn} onClick={handleRemove}>
                <TrashIcon className="size-6 text-primary" /> remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label htmlFor={name} className={styles.file_input_container}>
          <input
            type="file"
            name={name}
            id={name}
            onChange={handleChange}
            accept={accept}
          />

          <div>
            {fileType === "photo"&&<PhotoIcon className="size-14 text-primary" />}
            {fileType === "excel"&&<TableCellsIcon className="size-14 text-primary" />}
            
            <span>{btnText}</span>
            <p className={styles.desc}>{acceptDesc}</p>
          </div>
        </label>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
