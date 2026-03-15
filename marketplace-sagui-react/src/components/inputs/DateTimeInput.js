import React, { useEffect, useState } from "react";

export const DateTimeInput = ({
  label,
  valueDate,
  valueHour,
  onChangeDate,
  onChangeHour,
  errorType,
  setActionError,
}) => {
  const [error, setError] = useState(false);
  const handleChangeDate = (value) => {
    setError(false);
    const newDate = new Date(value).toISOString().split("T")[0];
    onChangeDate(newDate);
    let selectedTime = new Date(`${value}T${valueHour}`).getTime();
    let currentTime = new Date().getTime();
    if (errorType.type === "BEFORE") {
      let { to, diff, as } = errorType.params;

      if (selectedTime < currentTime) {
        setError(true);
      } else if (to.getTime() < selectedTime) {
        setError(true);
      } else {
        setError(false);
      }
    }
    if (errorType.type === "AFTER") {
      setError(false);
      let { to, diff, as } = errorType.params;

      if (to.getTime() > selectedTime) {
        setError(true);
      }

      if (as === "min") {
        if (selectedTime <= to.getTime() + diff * 60) {
          setError(true);
        } else {
          setError(false);
        }
      }
    }
  };
  const handleChangeHour = (value) => {
    setError(false);
    let selectedTime = new Date(`${valueDate}T${value}`).getTime();
    let currentTime = new Date().getTime();
    onChangeHour(value);
    if (errorType.type === "BEFORE") {
      let { to, diff, as } = errorType.params;

      if (selectedTime < currentTime) {
        setError(true);
      } else if (to.getTime() < selectedTime) {
        setError(true);
      } else {
        setError(false);
      }
    }
    if (errorType.type === "AFTER") {
      setError(false);
      let { to, diff, as } = errorType.params;

      if (to.getTime() > selectedTime) {
        setError(true);
      } else {
        if (as === "min") {
          if (selectedTime <= to.getTime() + diff * 3600) {
            setError(true);
          } else {
            setError(false);
          }
        }
      }
    }
  };

  useEffect(() => {
    setActionError(error);
    return () => {
      setActionError(false);
    };
  }, [error]);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <div>{label}</div>
        <div
          className={`flex border-2 ${
            error && "border-red-600"
          } rounded-md justify-between border dark:bg-dark-4 `}
        >
          <input
            value={valueDate}
            onChange={(e) => handleChangeDate(e.target.value)}
            className={`w-30 p-2 text-end dark:bg-dark-4 outline-0 `}
            type="date"
          />
          <input
            value={valueHour}
            onChange={(e) => handleChangeHour(e.target.value)}
            className={`w-30 p-2 text-end dark:bg-dark-4 outline-0`}
            type="time"
          />
        </div>
        {error && <div className="text-sm text-red-600">Invalid Date </div>}
      </div>
    </div>
  );
};
