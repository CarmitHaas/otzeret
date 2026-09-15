#!/usr/bin/env python3
"""Fetch a representative, freely licensed photo per hall/stop from Wikipedia lead images (via Wikimedia Commons),
resize to 960px, and write credits. Usage: python3 tools/fetch_images.py [ids...]"""
import json, re, sys, os, io, time, urllib.request, urllib.parse
from PIL import Image, ImageOps

UA = {"User-Agent": "OtzeretTripGame/1.0 (family trip app; contact via github)"}
OUT = "img"
MAP = {
  # halls
  "hall-d16": ["en:Rue Montorgueil"], "hall-d17": ["en:Louvre"], "hall-d18": ["file:Tour Eiffel Wikimedia Commons.jpg", "search:Eiffel Tower Trocadéro"], "hall-d19": ["en:Sacré-Cœur, Paris"],
  "hall-d20": ["en:Neal's Yard"], "hall-d21": ["en:Tower Bridge"], "hall-d22": ["en:British Museum"],
  "hall-d23": ["en:Le Château de la Belle au Bois Dormant", "search:Château de la Belle au Bois Dormant Disneyland Paris"], "hall-d24": ["en:Ratatouille: The Adventure", "en:Walt Disney Studios Park"],
  "hall-d25": ["en:Marseille-Saint-Charles station"], "hall-d26": ["en:La Ciotat"], "hall-d29": ["en:Calanques National Park"],
  # paris
  "arrival": ["search:Paris Orly airport terminal night", "search:Rue Montorgueil night"], "montorgueil": ["en:Rue Montorgueil"], "angelina": ["fr:Angelina (salon de thé)", "en:Rue de Rivoli"],
  "palais-royal": ["en:Palais-Royal"], "tuileries": ["en:Tuileries Garden"], "louvre": ["en:Liberty Leading the People"],
  "nose": ["en:Passage du Grand-Cerf", "search:Passage du Grand-Cerf Paris"], "rivoli59": ["en:59 Rivoli"], "sens": ["en:Hôtel de Sens"], "vosges": ["en:Place des Vosges"],
  "pavee": ["en:Agoudas Hakehilos Synagogue"], "rosiers": ["en:Rue des Rosiers"], "enfants-rouges": ["en:Marché des Enfants Rouges"],
  "eiffel": ["search:Eiffel Tower from below", "file:Tour Eiffel Wikimedia Commons.jpg"], "sainte-chapelle": ["en:Sainte-Chapelle"], "cite": ["en:Pont Neuf"], "notre-dame": ["en:Notre-Dame de Paris"],
  "berthillon": ["en:Île Saint-Louis"], "lafayette": ["en:Galeries Lafayette Haussmann", "fr:Galeries Lafayette Haussmann"], "luxembourg": ["en:Jardin du Luxembourg"],
  "cruise": ["en:Pont Alexandre III"], "sacre-coeur": ["en:Sacré-Cœur, Paris"], "tertre": ["en:Place du Tertre"],
  "passe-muraille": ["fr:Le Passe-muraille (sculpture)", "en:Le Passe-Muraille"], "bateau-lavoir": ["en:Bateau-Lavoir"],
  "deux-moulins": ["en:Café des Deux Moulins"], "mur": ["en:Le Mur des je t'aime", "fr:Le mur des je t'aime"], "eurostar": ["en:Channel Tunnel"],
  "st-pancras": ["en:St Pancras railway station"], "totoro": ["en:Gillian Lynne Theatre"],
  # london
  "fitzrovia": ["en:BT Tower"], "postal": ["en:London Post Office Railway"], "piazza": ["en:Covent Garden"], "neals-yard": ["en:Neal's Yard"],
  "seven-dials": ["en:Seven Dials, London"], "matilda": ["en:Cambridge Theatre"], "whitehall": ["en:Elizabeth Tower", "search:Elizabeth Tower Big Ben Westminster Bridge"], "southbank": ["en:London Eye"],
  "chinatown": ["en:Chinatown, London"], "guard": ["en:Buckingham Palace"], "boat": ["en:Millennium Bridge, London"], "tower": ["en:Tower of London"],
  "tower-bridge": ["en:Tower Bridge"], "borough": ["en:Borough Market"], "bus15": ["en:St Paul's Cathedral"],
  "national-gallery": ["en:A Wheatfield with Cypresses"], "carnaby": ["en:Carnaby Street"], "hamilton": ["en:Victoria Palace Theatre"],
  "platform": ["en:King's Cross railway station"], "transport": ["en:London Transport Museum"], "british-museum": ["en:Rosetta Stone"],
  "shoreditch": ["en:Shoreditch"], "brick-lane": ["en:Brick Lane Mosque"], "camden": ["en:Camden Market"], "eurostar-back": ["en:Eurostar"],
  # disney
  "castle": ["en:Le Château de la Belle au Bois Dormant"], "peter-pan": ["en:Peter Pan's Flight"], "big-thunder": ["en:Big Thunder Mountain Railroad"],
  "pirates": ["en:Pirates of the Caribbean (attraction)"], "small-world": ["en:It's a Small World"], "parade": ["en:Disney Stars on Parade", "en:Disneyland Park (Paris)"],
  "tales": ["en:Disneyland Park (Paris)"], "frozen": ["search:Frozen Ever After Disneyland Paris", "search:World of Frozen Disney Adventure World"], "ratatouille": ["en:Ratatouille: The Adventure"], "crush": ["en:Crush's Coaster"],
  "avengers": ["en:Avengers Campus"], "cascade": ["search:Disney Adventure World Adventure Bay", "en:Walt Disney Studios Park"],
  # south
  "ouigo": ["en:Ouigo", "en:LGV Méditerranée"], "st-charles": ["en:Marseille-Saint-Charles station"], "gare-la-ciotat": ["en:L'Arrivée d'un train en gare de La Ciotat"],
  "eden": ["en:Eden Théâtre", "fr:Eden Théâtre"], "vieux-port": ["search:La Ciotat chantiers navals portique", "en:La Ciotat"], "petanque": ["search:pétanque boules Provence", "en:Pétanque"], "mugel": ["fr:Bec de l'Aigle", "en:Parc du Mugel"],
  "ile-verte": ["fr:Île Verte (La Ciotat)", "en:La Ciotat"], "cassis": ["en:Cassis, Cap Lombard, Opus 196", "en:Cap Canaille"], "last-evening": ["search:La Ciotat sunset port", "en:Cap Canaille"],
  "home": ["en:Marseille Provence Airport"],
}

def get(url, binary=False, tries=4):
    for i in range(tries):
        try:
            time.sleep(0.7)
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
                return data if binary else json.loads(data.decode('utf-8'))
        except urllib.error.HTTPError as e:
            err = e
            if e.code == 429: time.sleep(8 * (i + 1))
            elif e.code == 404: raise
            else: time.sleep(2)
        except Exception as e:
            err = e; time.sleep(2)
    raise err

def summary(lang, title):
    return get(f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(title.replace(' ', '_'))}")

def commons_meta(filename):
    q = urllib.parse.quote("File:" + filename)
    data = get(f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={q}&prop=imageinfo&iiprop=extmetadata|url&iiurlwidth=1200")
    pages = data.get("query", {}).get("pages", {})
    for p in pages.values():
        ii = (p.get("imageinfo") or [None])[0]
        if not ii: return None
        m = ii.get("extmetadata", {})
        return {"license": m.get("LicenseShortName", {}).get("value", ""), "licenseUrl": m.get("LicenseUrl", {}).get("value", ""),
                "artist": re.sub("<[^>]+>", "", m.get("Artist", {}).get("value", "")).strip(), "thumb": ii.get("thumburl") or ii.get("url"),
                "page": ii.get("descriptionurl", "")}
    return None

def commons_search(query):
    q = urllib.parse.quote(query + " filetype:bitmap")
    data = get(f"https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch={q}&srnamespace=6&srlimit=12")
    out = []
    for hit in data.get("query", {}).get("search", []):
        t = hit["title"].replace("File:", "")
        if re.search(r"\.(jpe?g)$", t, re.I) and not re.search(r"logo|map|plan|diagram|icon", t, re.I): out.append(t)
    return out

def ok_license(lic):
    l = lic.lower()
    return ("cc" in l and "nc" not in l and "nd" not in l) or "public domain" in l or l in ("pd", "cc0")

def candidates(t):
    """Yield (filename, page_title) candidates for a target spec."""
    kind, val = t.split(":", 1)
    if kind == "file":
        yield val, val; return
    if kind == "search":
        for f in commons_search(val): yield f, val
        return
    try:
        s = summary(kind, val)
    except Exception as e:
        print(f"    no summary for {t} ({e})"); return
    img = (s.get("originalimage") or {}).get("source", "").split("?")[0]
    if img:
        fname = urllib.parse.unquote(img.rsplit("/", 1)[-1])
        if "/thumb/" in img: fname = urllib.parse.unquote(img.split("/thumb/")[1].split("/")[2])
        if re.search(r"\.(jpe?g|png)$", fname, re.I) and not re.search(r"logo", fname, re.I):
            yield fname, s.get("title", val)
        else:
            print(f"    {t}: lead image is {fname}, trying search")
    for f in commons_search(val.split(" (")[0]): yield f, s.get("title", val)

def process(id_, targets, credits):
    if os.path.exists(f"{OUT}/{id_}.jpg") and any(c["id"] == id_ for c in credits):
        print(f"  {id_}: exists"); return True
    for t in targets:
      for fname, title in candidates(t):
        meta = commons_meta(fname)
        if not meta or not ok_license(meta["license"]):
            print(f"  {id_}: skipping {fname} (license {meta and meta['license']})"); continue
        try:
            raw = get(meta["thumb"], binary=True)
            im = Image.open(io.BytesIO(raw)); im = ImageOps.exif_transpose(im).convert("RGB")
            w, h = im.size
            scale = min(1.0, 960 / w)
            im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
            # crop extreme aspect ratios to at most 2:1 / 1:1.4
            w, h = im.size
            if w / h > 2.0: nh = int(w / 2.0); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
            if h / w > 1.4: nw = w; nh2 = int(w * 1.4); im = im.crop((0, (h - nh2) // 2, nw, (h - nh2) // 2 + nh2))
            im.save(f"{OUT}/{id_}.jpg", "JPEG", quality=78, optimize=True, progressive=True)
            credits.append({"id": id_, "file": fname, "title": title, "artist": meta["artist"][:80], "license": meta["license"], "licenseUrl": meta["licenseUrl"], "page": meta["page"]})
            print(f"  {id_}: OK {fname} [{meta['license']}] {os.path.getsize(f'{OUT}/{id_}.jpg')//1024}KB")
            return True
        except Exception as e:
            print(f"  {id_}: download failed {fname} ({e})")
    return False

if __name__ == "__main__":
    ids = sys.argv[1:] or list(MAP.keys())
    credits = []
    if os.path.exists("js/credits.js"):
        try:
            txt = open("js/credits.js", encoding="utf-8").read()
            credits = json.loads(txt[txt.index("["): txt.rindex("]") + 1])
        except Exception: credits = []
    for id_ in ids:
        process(id_, MAP[id_], credits)
    credits.sort(key=lambda c: c["id"])
    with open("js/credits.js", "w", encoding="utf-8") as f:
        f.write("/* Image credits (generated by tools/fetch_images.py). */\nself.OTZ_CREDITS = " + json.dumps(credits, ensure_ascii=False, indent=1) + ";\n")
    with open("CREDITS.md", "w", encoding="utf-8") as f:
        f.write("# Image credits\n\nPhotographs come from Wikimedia Commons via Wikipedia lead images, resized. Each line: app image, source file, author, license.\n\n")
        for c in credits:
            f.write(f"- `img/{c['id']}.jpg`: [{c['file']}]({c['page']}) — {c['artist'] or 'unknown author'} — [{c['license']}]({c['licenseUrl'] or c['page']})\n")
    print(f"done: {len(credits)} images")
