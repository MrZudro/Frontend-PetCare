import { FaFilter } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";;
import { RiArrowDropDownLine } from "react-icons/ri";
import { useState } from "react";

export default function WishlistMq() {
    const contador = 2;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    return (
        <div className="h-screen w-screen">
            <div className="flex flex-row justify-between p-4 items-center">
                <h1 className=" font-medium text-2xl">Wishlist ({contador})</h1>
                <div className="flex flex-row justify-end">
                    <button onClick={()=>{setIsFilterOpen(!isFilterOpen)}}className="flex flex-row
                                        items-center p-2 text-[22px]"><FaFilter/><RiArrowDropDownLine className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : 'rotate-0'}`}/>
                    </button>
                    <button className="items-center p-3 text-[25px]">
                        <FaShoppingCart/>
                    </button> 
                </div>
            </div>
        </div>
    )
}
