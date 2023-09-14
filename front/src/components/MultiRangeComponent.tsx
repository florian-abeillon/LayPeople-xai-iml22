import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef
} from "react";
import "./multiRangeSlider.css";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  minVal: number;
  setMinVal: (val: number) => void;
  maxVal: number;
  setMaxVal: (val: number) => void;
}


const MultiRangeSlider: FC<MultiRangeSliderProps> = ({
  maxVal,
  minVal,
  setMaxVal,
  setMinVal,
  min,
  max,
}: MultiRangeSliderProps) => {
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const midRange = useRef<HTMLDivElement>(null);
  const lowestRange = useRef<HTMLDivElement>(null);
  const highestRange = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the midRange to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

      if (midRange.current && lowestRange.current) {
        midRange.current.style.left = `${minPercent}%`;
        midRange.current.style.width = `${maxPercent - minPercent}%`;
        lowestRange.current.style.width = `${minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the midRange to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (midRange.current && highestRange.current) {
        midRange.current.style.width = `${maxPercent - minPercent}%`;
        highestRange.current.style.width = `${100 - maxPercent}%`;
        highestRange.current.style.left = `${maxPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  return (
    <div className="mb-10 flex flex-col">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className="thumb w-96 thumb--zindex-3"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="thumb thumb--zindex-4"
        // className="absolute h-0 appearance-none border-none"
      />

      <div className="relative w-96">
        <div className="absolute rounded-sm h-1 bg-gray-50 w-full z-[1]"></div>
        <div ref={midRange} className="rounded-sm h-2 absolute z-[2] bg-sky-400"></div>
        <div ref={lowestRange} className="left-0 rounded-sm h-2 absolute z-[2] bg-yellow-600"></div>
        <div ref={highestRange} className="left-0 rounded-sm h-2 absolute z-[2] bg-teal-600"></div>
        <div className="absolute text-yellow-600 font-bold left-2 mt-5">Popularity: {minVal}%</div>
        <div className="absolute text-sky-400 font-bold left-36 mt-5">Content sim.: {maxVal - minVal}%</div>
        <div className="absolute text-teal-600 font-bold right-[-4px] mt-5">User sim.: {100 - maxVal}%</div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
