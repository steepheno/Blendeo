import * as React from 'react';
import { ImageComponent } from '../record/ImageComponent';
import { PlaybackControl } from '../record/PlaybackControl';
import Navbar from '../common/Navbar';
import WebCamera from '../record/WebCamera';

export const RecordLayout = () => {
  const [currentTime] = React.useState('0:15');
  const [duration] = React.useState('3:45');
  const [progress] = React.useState(15);

  return (
    <div className="flex flex-col">
      <div className="flex overflow-hidden flex-col w-full bg-stone-950 max-md:max-w-full">
        <Navbar />
        <main className="flex flex-col flex-1 w-full max-md:max-w-full justify-center">
          <div className="flex flex-wrap flex-1 justify-center items-center size-full max-md:max-w-full">
            <div className="flex overflow-hidden flex-col justify-center items-center self-stretch px-5 my-auto rotate-[3.141592653589793rad] w-[88px]">
              <div className="flex pt-1.5 min-h-[317px]" />
              <ImageComponent
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e7977e42b45afa4f15e1dda9dccb118de198aa22f05cde5f60c4d4a6712f9cbf?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
                alt="Music Control"
                className="object-contain mt-10 w-12 aspect-square"
              />
            </div>
            <div className="flex flex-col items-center self-stretch my-auto min-w-[240px] w-[962px] max-md:max-w-full">
              <div className="flex overflow-hidden flex-col justify-center items-center max-w-full w-[768px]">
                <div className="flex overflow-hidden flex-col justify-center w-full max-w-screen-md min-h-[768px] max-md:max-w-full">
                  <div className="flex flex-wrap flex-1 justify-center items-center rounded-xl size-full max-md:max-w-full">
                    <div className="flex grow shrink self-stretch my-auto bg-neutral-200 h-[540px] min-w-[240px] w-[307px]" />
                    <div className="flex grow shrink self-stretch my-auto bg-stone-300 h-[540px] min-w-[240px] w-[307px]">
                      {/* <WebCamera /> */}
                    </div>
                  </div>
                </div>
              </div>
              <PlaybackControl
                currentTime={currentTime}
                duration={duration}
                progress={progress}
              />
              <div className="flex overflow-hidden flex-wrap gap-2.5 justify-center items-center max-w-full w-[816px]">
                <div className="flex overflow-hidden flex-wrap grow shrink gap-10 justify-center items-center self-stretch px-5 my-auto min-w-[240px] rotate-[3.141592653589793rad] w-[653px]">
                  <button onClick={() => {}} className="focus:outline-none">
                    <ImageComponent
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/c15f8580fb3866fd01a4cd2067c61ff47de4aabbf1d96e7a9cab44ad56c51559?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
                      alt="Previous Track"
                      className="object-contain shrink-0 self-stretch my-auto aspect-square w-[60px]"
                    />
                  </button>
                  <button onClick={() => {}} className="focus:outline-none">
                    <ImageComponent
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/c4fb916d889dc55dbd3feb6af5e158dc8f1eb8f7e7f308691a72c6dc14e5a098?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
                      alt="Next Track"
                      className="object-contain shrink-0 self-stretch my-auto aspect-square w-[60px]"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 self-stretch my-auto h-[405px] rotate-[3.141592653589793rad] w-[88px]" />
          </div>
        </main>
      </div>
    </div>
  );
};