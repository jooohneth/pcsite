import asyncio
import time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pypartpicker import Client

class SearchPartsView(APIView):
    def get(self, request):
        keyword = request.GET.get("q")
        region = request.GET.get("region", "ca")
        client = Client(no_js=True) 
        parts = []

        def format_part(part):
            return {
                "name": part.name,
                "url": part.url,
                "price": float(part.cheapest_price.total) if part.cheapest_price else None,
            }

        try:
            queries = [keyword] if keyword else [
                "Ryzen", "Intel CPU", "RTX", "RX", "GTX", "DDR4", "DDR5",
                "NVMe SSD", "7200 RPM HDD", "Power Supply",
                "PC Case", "120mm Fan", "ATX Motherboard"
            ]

            for q in queries:
                try:
                    search_result = client.get_part_search(q, region=region)
                    for part in search_result.parts:
                        if part.cheapest_price:
                            parts.append(format_part(part))
                except Exception as e:
                    print(f"Error during query '{q}': {e}")
                time.sleep(1.2)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

        return Response({
            "query": keyword if keyword else "all",
            "region": region,
            "results": parts
        }, status=status.HTTP_200_OK)
        
class PartSpecsView(APIView):
    def get(self, request):
        def run_async_part_fetch(client, url):
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                return loop.run_until_complete(client.get_part(url))
            finally:
                loop.close()
        url = request.GET.get("url")
        if not url:
            return Response({"error": "Missing 'url' parameter"}, status=400)

        try:
            client = Client()
            part = run_async_part_fetch(client, url)
            return Response({
                "name": part.name,
                "url": part.url,
                "price": float(part.cheapest_price.total) if part.cheapest_price else None,
                "specs": part.specs or {},
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)
