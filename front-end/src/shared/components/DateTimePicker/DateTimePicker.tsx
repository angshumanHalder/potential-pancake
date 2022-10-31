import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import { InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

import "react-datepicker/dist/react-datepicker.css";
import "./chakra-react-datepicker.css";

const customDateInput = ({ value, onClick, onChange, name }: any, ref: any) => (
  <Input autoComplete="off" value={value} ref={ref} onClick={onClick} onChange={onChange} name={name} />
);
customDateInput.displayName = "DateInput";

const CustomInput = forwardRef(customDateInput);

const icon = <CalendarIcon fontSize="sm" />;

interface Props {
  isClearable?: boolean;
  onChange: (date: Date) => any;
  selectedDate: Date | undefined;
  showPopperArrow?: boolean;
  showTimeSelect?: boolean;
  name: string;
  dateFormat: string;
  minDate: Date;
}

export const DatePicker: React.FC<Props> = ({ selectedDate, onChange, name, dateFormat, minDate, ...props }) => {
  return (
    <>
      <InputGroup className="dark-theme">
        <ReactDatePicker
          selected={selectedDate}
          onChange={onChange}
          className="react-datapicker__input-text"
          customInput={<CustomInput />}
          dateFormat={dateFormat}
          name={name}
          minDate={minDate}
          {...props}
        />
        <InputRightElement color="white" children={icon} />
      </InputGroup>
    </>
  );
};
