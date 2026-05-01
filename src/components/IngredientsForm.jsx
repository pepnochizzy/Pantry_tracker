export default function IngredientsForm({ index }) {
  return (
    <div>
      <label htmlFor={`ingredientName-${index}`}>Ingredient: </label>
      <input
        type="text"
        id={`ingredientName-${index}`}
        name={`ingredientName-${index}`}
        required
      />
      <label htmlFor={`quantity-${index}`}>Quantity: </label>
      <input
        type="number"
        min="0.1"
        id={`quantity-${index}`}
        name={`quantity-${index}`}
        required
      ></input>
      <label htmlFor={`unit-${index}`}>Unit: </label>
      <select id={`unit-${index}`} name={`unit-${index}`} required>
        <option disabled value="">
          Select
        </option>
        <option value="grams">grams</option>
        <option value="kg">kg</option>
        <option value="ml">Ml</option>
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
