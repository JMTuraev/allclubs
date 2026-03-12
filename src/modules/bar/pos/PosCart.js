import { useBar } from "../../../context/bar/BarContext";
import {
  addItemToCheck,
  removeItemFromCheck
} from "../domain/barChecks";

export default function PosCart({ selectedClient, sessionId }) {

  const {
    checkItems,
    checkTotal,
    savePosCheck
  } = useBar();

  const handleIncrease = async (item) => {
    await addItemToCheck(item.checkId, {
      id: item.productId,
      name: item.name,
      price: item.price
    });
  };

  const handleRemove = async (item) => {
    await removeItemFromCheck(item.checkId, item);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white p-4">

      <h2 className="text-lg font-semibold mb-4">
        Cart
      </h2>

      <div className="flex-1 overflow-y-auto space-y-3">

        {checkItems.map(item => (

          <div
            key={item.id}
            className="flex justify-between items-center bg-zinc-800 p-3 rounded-lg"
          >

            <div>
              <div className="font-medium">
                {item.name}
              </div>

              <div className="text-sm text-zinc-400">
                {item.price} × {item.qty}
              </div>
            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={() => handleIncrease(item)}
                className="bg-indigo-600 px-2 py-1 rounded"
              >
                +
              </button>

              <button
                onClick={() => handleRemove(item)}
                className="bg-red-500 px-2 py-1 rounded"
              >
                ×
              </button>

            </div>

          </div>

        ))}

      </div>

      <div className="border-t border-zinc-700 pt-4 mt-4">

        <div className="flex justify-between mb-3">
          <span>Total</span>
          <span className="font-semibold">
            {checkTotal}
          </span>
        </div>

        <button
          disabled={!checkItems.length}
          onClick={() =>
            savePosCheck(
              selectedClient.id,
              sessionId,
              { cash: checkTotal }
            )
          }
          className="w-full bg-green-600 py-2 rounded-lg font-semibold disabled:opacity-40"
        >
          Pay
        </button>

      </div>

    </div>
  );

}