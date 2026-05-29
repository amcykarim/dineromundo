import json
import urllib.request

def fetch_rates():
    # Free public exchange rate API (No keys required, 100% free)
    url = "https://open.er-api.com/v6/latest/USD"
    
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            if data.get("result") == "success":
                return data.get("rates", {})
    except Exception as e:
        print(f"Error fetching rates: {e}")
    return None

def main():
    rates = fetch_rates()
    if not rates:
        print("Could not retrieve market rates. Exiting.")
        return

    # Base mid-market rates relative to 1 USD
    usd_to_mxn = rates.get("MXN", 17.5)
    usd_to_dop = rates.get("DOP", 58.5)
    usd_to_cop = rates.get("COP", 4100.0)
    usd_to_gtq = rates.get("GTQ", 7.8)
    usd_to_hnl = rates.get("HNL", 24.6)

    # Cross-rate helpers for Euro (EUR) sending origins
    eur_to_usd = 1.0 / rates.get("EUR", 0.92)

    # Generate the calculated rates data structure matching your index.html pairs
    # Western Union typically subtracts roughly 0.8% to 1.2% from mid-market
    # Wise stays much closer to mid-market but takes a small upfront structural fee
    rates_data = {
        "USD_MXN": {
            "western_union": round(usd_to_mxn * 0.988, 2),
            "wise": round(usd_to_mxn * 0.997, 2)
        },
        "USD_DOP": {
            "western_union": round(usd_to_dop * 0.985, 2),
            "wise": round(usd_to_dop * 0.996, 2)
        },
        "USD_COP": {
            "western_union": round(usd_to_cop * 0.986, 1),
            "wise": round(usd_to_cop * 0.997, 1)
        },
        "USD_GTQ": {
            "western_union": round(usd_to_gtq * 0.987, 2),
            "wise": round(usd_to_gtq * 0.996, 2)
        },
        "USD_HNL": {
            "western_union": round(usd_to_hnl * 0.985, 2),
            "wise": round(usd_to_hnl * 0.995, 2)
        },
        # EUR origins (calculated out cleanly via cross rates)
        "EUR_MXN": {
            "western_union": round((usd_to_mxn * eur_to_usd) * 0.986, 2),
            "wise": round((usd_to_mxn * eur_to_usd) * 0.996, 2)
        },
        "EUR_COL": {
            "western_union": round((usd_to_cop * eur_to_usd) * 0.985, 1),
            "wise": round((usd_to_cop * eur_to_usd) * 0.996, 1)
        }
    }

    # Save the output directly into rates.json for index.html to read
    with open("rates.json", "w") as outfile:
        json.dump(rates_data, outfile, indent=4)
    
    print("Successfully updated rates.json with fresh pricing calculations!")

if __name__ == "__main__":
    main()
