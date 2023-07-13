import React from "react";

import { AplhabetsImages } from "./Images";

const Collection = () => {
  return (
    <div className='bg-zinc-900 p-2 '>
      <div className='text-center shadow m-3'>
        <h1 className='text-3xl bg-gradient-to-r from-teal-400 to-fuchsia-500 text-transparent bg-clip-text'>
          <span className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl'>
            Alphabets
          </span>
        </h1>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-10 '>
        {AplhabetsImages.map((img) => {
          return (
            <div
              key={"" + img}
              className='w-[fit-content] h-[fit-content] rounded-2xl overflow-hidden relative'
            >
              <img className='' src={img} alt={"" + img} />

              <div className=' hover:backdrop-blur-sm bg-opacity-40 overlay absolute inset-0 flex items-center justify-center hover:bg-gradient-to-r hover:from-teal-400 hover:to-fuchsia-500 hover:text-transparent hover:bg-clip-text'>
                <button
                  onClick={() => console.log("Mint Button Clicked")}
                  className='text-transparent mint-button bg-transparent hover:bg-gradient-to-r hover:from-teal-400 hover:to-fuchsia-500 hover:text-transparent hover:bg-clip-text'
                >
                  <h4 className='text-3xl'>
                    <span className='text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>
                      Mint
                    </span>
                  </h4>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Collection;
