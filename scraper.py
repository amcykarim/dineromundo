import json
import urllib.request
import os

def fetch_rates():
    # Free, reliable API endpoint for currency rates relative to USD
    url = "https://open.er-api.com/v6/latest/USD"
    
    try:
        print("Fetching latest exchange rates...")
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            
        if data.get("result") == "success":
            rates = data.get("rates", {})
            
            # Master list of all 9 countries
            target_currencies = {
                "MXN": rates.get("MXN"),
                "COP": rates.get("COP"),
                "DOP": rates.get("DOP"),
                "GTQ": rates.get("GTQ"),
                "HNL": rates.get("HNL"),
                "ARS": rates.get("ARS"),
                "PEN": rates.get("PEN"),
                "VES": rates.get("VES"),
                "CLP": rates.get("CLP")
            }
            
            # Filter out any currencies that failed to fetch
            filtered_rates = {k: v for k, v in target_currencies.items() if v is not None}
            
            # Save data cleanly into rates.json
            output_file = "rates.json"
            with open(output_file, "w") as f:
                json.dump(filtered_rates, f, indent=4)
                
            print("Successfully updated rates.json with all 9 countries!")
            print(filtered_rates)
        else:
            print("Error: API response was not successful.")
            
    except Exception as e:
        print(f"An error occurred while fetching rates: {e}")

if __name__ == "__main__":
    fetch_rates()
