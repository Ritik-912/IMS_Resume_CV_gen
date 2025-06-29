from datetime import datetime

def format_dates(data: dict) -> dict:
    # Format DOB
    raw_dob = data.get("dob")
    if raw_dob:
        dob_obj = datetime.strptime(raw_dob, "%Y-%m-%d")
        data["dob"] = dob_obj.strftime("%B %d, %Y")
    else:
        data["dob"] = ""

    # Format experience dates
    experience = data.get("experience", [])
    for exp in experience:
        if "startDate" in exp:
            start_date_obj = datetime.strptime(exp["startDate"], "%Y-%m")
            exp["startDate"] = start_date_obj.strftime("%B %Y")
        if "endDate" in exp:
            end_date_obj = datetime.strptime(exp["endDate"], "%Y-%m")
            exp["endDate"] = end_date_obj.strftime("%B %Y")
    return data