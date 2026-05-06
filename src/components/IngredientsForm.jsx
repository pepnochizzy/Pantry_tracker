"use client";
export default function IngredientsForm({ index, handleChange }) {
  return (
    <div>
      <label htmlFor="name">Ingredient: </label>
      <input
        type="text"
        id="name"
        name="name"
        required
        onChange={(e) => handleChange(index, e)}
      />
      <label htmlFor="quantity">Quantity: </label>
      <input
        type="number"
        id="quantity"
        name="quantity"
        required
        onChange={(e) => handleChange(index, e)}
      ></input>
      <label htmlFor="unit">Unit: </label>
      <select
        id="unit"
        name="unit"
        required
        onChange={(e) => handleChange(index, e)}
        defaultValue={"DEFAULT"}
      >
        <option value="DEFAULT" disabled hidden>
          Select
        </option>
        <option value="grams">grams</option>
        <option value="kg">kg</option>
        <option value="ml">ml</option>
        <option value="litre">litre</option>
        <option value="floz">fl oz</option>
        <option value="oz">oz</option>
        <option value="lbs">lbs</option>
        <option value="quart">quart</option>
        <option value="pint">pint</option>
        <option value="cups">cups</option>
        <option value="tsp">tsp</option>
        <option value="tbsp">tbsp</option>
        <option value="pinch">pinch</option>
        <option value="sprig">sprig</option>
        <option value="can">can</option>
      </select>
    </div>
  );
}
