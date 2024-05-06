import React, { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import { UserMinus } from 'react-feather';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  initOption: any,
  placeholder: string
}

function DebounceSelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 800, initOption, placeholder, ...props }: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([...initOption]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {  
      const data = initOption.filter((option: any) => (option?.label ?? '').toLowerCase().includes(value.toLowerCase()))
      if (data.length > 0) {
        setOptions(data)
      }
      else {  
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);
        fetchOptions(value).then((newOptions) => {
          
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }

          setOptions(newOptions);
          setFetching(false);
        });
      }
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, initOption, fetchOptions]);
  useEffect(() => {
   setOptions(initOption)
  }, [initOption])

  return (
    <Select
  
      allowClear
      showSearch
      placeholder={placeholder}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

export default DebounceSelect