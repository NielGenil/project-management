import time
import ntplib
from datetime import datetime, timezone
import pytz
from django.utils.timezone import now
from colorama import Fore
from rest_framework.decorators import api_view
from rest_framework.response import Response

PH_TZ = pytz.timezone("Asia/Manila")
TIME_OFFSET = 0.0  # difference between system clock and NTP time


def sync_with_ntp_servers(servers=None, timeout=3):
    """
    Try syncing with public NTP servers.
    Sets a global TIME_OFFSET used for time correction.
    """
    global TIME_OFFSET
    servers = servers or [
        "pool.ntp.org",
        "time.google.com",
        "time.windows.com",
        "time.apple.com",
    ]

    client = ntplib.NTPClient()

    for server in servers:
        try:
            response = client.request(server, version=3, timeout=timeout)
            TIME_OFFSET = response.tx_time - time.time()
            print(Fore.GREEN + f"[TIME] Synced with {server}, offset={TIME_OFFSET:.3f}s")
            return True
        except Exception:
            continue

    print(Fore.RED + "[TIME] Failed to sync with NTP servers. Using system clock.")
    TIME_OFFSET = 0.0
    return False


def get_ph_time():
    """
    Returns a timezone-aware datetime for Asia/Manila.
    Syncs with NTP servers if available, otherwise falls back to system clock.
    """
    try:
        adjusted_timestamp = time.time() + TIME_OFFSET
        dt = datetime.fromtimestamp(adjusted_timestamp, tz=timezone.utc).astimezone(PH_TZ)
        return dt
    except Exception:
        # fallback if something goes wrong
        return now().astimezone(PH_TZ)


def get_ph_date():
    """
    Returns the current date (YYYY-MM-DD) in Asia/Manila timezone.
    """
    return get_ph_time().date()

@api_view(["GET"])
def server_date(request):
    """
    Returns current server date and time in Manila timezone.
    """
    dt = get_ph_time()  # timezone-aware datetime
    date_str = dt.strftime("%Y-%m-%d")
    time_str = dt.strftime("%H:%M:%S")
    return Response({"date": date_str, "time": time_str})
