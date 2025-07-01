import AddInstrumentRental from "../components/AddInstrumentRental";
import InstrumentRentalList from "../components/common/InstrumentRentalList";

function InstrumentPage() {
  return (
    <div>
      <div className="flex">
        <div>
          <AddInstrumentRental />
        </div>
        <div>
          <InstrumentRentalList />
        </div>
      </div>
    </div>
  );
}

export default InstrumentPage;
