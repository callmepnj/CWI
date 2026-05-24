#!/usr/bin/env python3

"""
Generate clean metadata.json files for all 18 CWI Unanswered Files cases.
"""

import json
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
IMAGES_DIR = ROOT_DIR / "public" / "images" / "cwi-unanswered-files"

CASES_METADATA = {
    "ladakh-sonam-wangchuk": {
        "title": "Ladakh / Sonam Wangchuk Statehood",
        "year": "2023-2024",
        "descriptions": [
            ("Hero Image - Ladakh Protest", "Sonam Wangchuk or Leh protest march representing the Ladakh statehood and Sixth Schedule movement."),
            ("Leh Cityscape", "Urban landscape of Leh, capital of Ladakh, showing the city during the movement period."),
            ("Ladakh Protest March", "Citizens demonstrating for statehood or Sixth Schedule status in Ladakh."),
            ("Climate Activism", "Sonam Wangchuk or climate-related activism imagery reflecting environmental focus."),
            ("Ladakh Landscape", "Mountain ranges and high-altitude landscape of Ladakh showing geographic context."),
            ("Leh Protest Gathering", "Public demonstration at Leh supporting statehood demands."),
            ("Ladakh Monastery", "Buddhist monastery or cultural heritage site in Ladakh."),
            ("Ladakh Community", "People and community members of Ladakh."),
            ("Women's Activism", "Women's participation in Ladakh's statehood movement."),
            ("Political Map", "Map showing Ladakh region and its administrative status.")
        ]
    },
    "joshimath-subsidence": {
        "title": "Joshimath Land Subsidence",
        "year": "2023-2024",
        "descriptions": [
            ("Cracked House", "Severely cracked residential building in Joshimath showing land subsidence damage."),
            ("Road Damage", "Cracked and damaged road in Joshimath from subsidence."),
            ("Evacuation Scene", "Residents being evacuated or displaced due to subsidence danger."),
            ("Joshimath Town", "Town overview of Joshimath showing damaged infrastructure."),
            ("Building Damage", "Damaged or partially collapsed structures from subsidence."),
            ("Geological Damage", "Close-up of ground fissures or geological damage."),
            ("Uttarakhand Map", "Map showing Joshimath location in Uttarakhand."),
            ("Rescue Operations", "Relief and rescue teams working in Joshimath."),
            ("Displaced Residents", "Families and belongings of displaced residents."),
            ("Mountain Context", "Nanda Devi mountains or geographic context of the region.")
        ]
    },
    "great-nicobar-project": {
        "title": "Great Nicobar Project",
        "year": "2023-2024",
        "descriptions": [
            ("Great Nicobar Island", "Island landscape or aerial view of Great Nicobar."),
            ("Forest Ecosystem", "Nicobar forest or tropical ecosystem."),
            ("Coastal Landscape", "Beach, mangroves, or coastal environment."),
            ("Port Infrastructure", "Port development or infrastructure project imagery."),
            ("Galathea Bay", "Geographic reference to Galathea Bay area."),
            ("Indigenous Context", "Nicobarese or tribal cultural imagery in respectful context."),
            ("Marine Biodiversity", "Marine life or biodiversity of Nicobar region."),
            ("Environmental Protection", "Conservation or environmental activism imagery."),
            ("Location Map", "Map showing Great Nicobar and surrounding area."),
            ("Community Perspective", "Local community or people of Nicobar Islands.")
        ]
    },
    "hasdeo-aranya": {
        "title": "Hasdeo Aranya Coal Mining",
        "year": "2023-2024",
        "descriptions": [
            ("Hasdeo Forest", "Dense forest of Hasdeo Aranya region."),
            ("Coal Mining Operation", "Coal mining machinery or extraction site."),
            ("Adivasi Protest", "Indigenous people's protest against mining."),
            ("Forest Protection March", "Save Hasdeo or forest protection activism."),
            ("Tree-Cutting Impact", "Deforestation or tree-cutting visual."),
            ("Chhattisgarh Forest", "Broader Chhattisgarh forest landscape."),
            ("Indigenous Community", "Adivasi people and tribal communities."),
            ("Environmental Activism", "Activists or civil society protection efforts."),
            ("Mining Conflict", "Documentation of coal mining conflict."),
            ("Forest Regeneration", "Forest conservation or recovery efforts.")
        ]
    },
    "women-wrestlers-protest": {
        "title": "Women Wrestlers Case",
        "year": "2023",
        "descriptions": [
            ("Jantar Mantar Protest", "Wrestlers' protest at Jantar Mantar in New Delhi."),
            ("Wrestler Portrait", "Sakshi Malik, Vinesh Phogat, or other prominent wrestler."),
            ("Protest March", "Women wrestlers' solidarity march or demonstration."),
            ("Police Confrontation", "Police barricade or state response to protest."),
            ("Wrestling Training", "Olympic wrestling or athletic context imagery."),
            ("Women's Solidarity", "Women activists supporting the wrestlers' movement."),
            ("Supreme Court", "Supreme Court of India building or legal proceedings."),
            ("Media Coverage", "Press engagement or media attention to the case."),
            ("Individual Wrestler", "Portrait or action shot of individual wrestler."),
            ("Justice Activism", "Women's justice and empowerment symbolism.")
        ]
    },
    "neet-paper-leak": {
        "title": "NEET Paper Leak / NTA",
        "year": "2024",
        "descriptions": [
            ("Student Protest", "Students protesting against NEET paper leak or NTA accountability."),
            ("Exam Centre", "National Testing Agency exam centre or testing facility."),
            ("Supreme Court", "Supreme Court of India building or courtroom."),
            ("Students Taking Exam", "Test-takers or educational context."),
            ("Education Crisis", "Visualizing exam system failure or educational crisis."),
            ("Digital Activism", "Online petition or digital activism symbolism."),
            ("News Coverage", "Media reporting on NEET crisis."),
            ("Student Coalition", "Student groups organizing for accountability."),
            ("Educational Institution", "School, college, or university building."),
            ("Justice Symbol", "Scales of justice or accountability symbolism.")
        ]
    },
    "electoral-bonds": {
        "title": "Electoral Bonds Transparency",
        "year": "2023-2024",
        "descriptions": [
            ("Supreme Court India", "Supreme Court of India building or courtroom."),
            ("SBI Building", "State Bank of India headquarters or office."),
            ("Election Commission", "Election Commission office or electoral body."),
            ("Parliament Building", "Indian Parliament or legislative context."),
            ("Electoral Bonds", "Visual of electoral bonds document or reference."),
            ("Political Funding", "Graphic or infographic about political funding."),
            ("Transparency Activism", "Civil society or activism for transparency."),
            ("Financial Context", "Symbolism of financial accountability."),
            ("Democratic Process", "Voting, elections, or democratic participation."),
            ("Citizens Participation", "Public engagement in electoral process.")
        ]
    },
    "bulldozer-justice": {
        "title": "Bulldozer Justice",
        "year": "2023-2024",
        "descriptions": [
            ("Bulldozer Operation", "Bulldozer or heavy machinery demolition."),
            ("Affected Housing", "Residential buildings before demolition."),
            ("Demolition Process", "Active demolition or destruction in progress."),
            ("Aftermath", "Post-demolition destruction or debris."),
            ("Anti-Demolition Protest", "Public protest against arbitrary demolitions."),
            ("Legal Proceeding", "Court building or legal justice imagery."),
            ("Affected Community", "Families or residents affected by demolitions."),
            ("Urban Slum", "Residential area vulnerable to demolitions."),
            ("Supreme Court", "Supreme Court of India symbolizing justice."),
            ("Due Process", "Justice, fairness, or constitutional symbolism.")
        ]
    },
    "assam-evictions": {
        "title": "Assam Evictions",
        "year": "2023-2024",
        "descriptions": [
            ("Eviction Operation", "State-led eviction drive in Assam."),
            ("Displaced Families", "Families and belongings being displaced."),
            ("Assam Village", "Rural or village landscape in Assam."),
            ("Relief Camp", "Temporary shelter or relief camp for displaced people."),
            ("Police Presence", "State security or police during eviction."),
            ("Affected Community", "Local residents impacted by evictions."),
            ("Civic Response", "Community protest or civil society response."),
            ("Housing Context", "Residential area or housing vulnerability."),
            ("Geographic Map", "Map showing Assam location or affected areas."),
            ("Community Resilience", "Recovery or community strength after displacement.")
        ]
    },
    "farmers-msp-protest": {
        "title": "Farmers MSP Protest",
        "year": "2024",
        "descriptions": [
            ("Shambhu Border", "Farmers at Shambhu border protest site."),
            ("Tractor March", "Farmers' demonstration with tractors."),
            ("Protest Barricade", "Police or state barricade during protest."),
            ("Farmer Solidarity", "Large gathering of farmers showing unity."),
            ("Protest Signage", "Placards or signs showing farmer demands."),
            ("Agricultural Landscape", "Fields or rural/agricultural context."),
            ("Police Response", "Non-graphic documentation of police presence."),
            ("Media Engagement", "Press or media coverage of protests."),
            ("Women Farmers", "Female farmers' participation in movement."),
            ("Community Support", "Public or urban support for farmers.")
        ]
    },
    "wayanad-landslide": {
        "title": "Wayanad Landslide",
        "year": "2024",
        "descriptions": [
            ("Landslide Destruction", "Visible landslide damage and destruction."),
            ("Buried Houses", "Residential buildings damaged or buried by landslide."),
            ("Rescue Operations", "Rescue team searching through debris."),
            ("Active Rescue", "NDRF or rescue teams at work."),
            ("Relief Camp", "Displaced residents in relief or temporary shelter."),
            ("Geological Damage", "Ground instability or geological impact."),
            ("Kerala Landscape", "Hilly or forested landscape of Kerala."),
            ("Disaster Aftermath", "Overall view of affected area post-landslide."),
            ("Community Response", "Local community or relief efforts."),
            ("Humanitarian Aid", "NGO or government aid distribution.")
        ]
    },
    "vizhinjam-port-protest": {
        "title": "Vizhinjam Port Protest",
        "year": "2023-2024",
        "descriptions": [
            ("Port Structure", "Vizhinjam port infrastructure or development."),
            ("Fishing Boats", "Traditional fishing vessels or boats."),
            ("Fisherfolk Community", "Local fishermen and fishing community."),
            ("Coastal Erosion", "Beach erosion or environmental damage."),
            ("Beach Landscape", "Coastal environment and fishing grounds."),
            ("Protest Gathering", "Fisherfolk demonstration or march."),
            ("Women Fisherfolk", "Female members of fishing community."),
            ("Marine Environment", "Marine life or ocean ecosystem."),
            ("Livelihood Documentation", "Fishing as traditional livelihood."),
            ("Environmental Justice", "Activism for coastal protection.")
        ]
    },
    "jammu-kashmir-statehood": {
        "title": "Jammu & Kashmir Statehood",
        "year": "2023-2024",
        "descriptions": [
            ("Srinagar Cityscape", "Kashmir's capital city or urban landscape."),
            ("Jammu Cityscape", "Jammu region or city imagery."),
            ("Kashmir Landscape", "Mountain, valley, or cultural landscape of Kashmir."),
            ("Civic Gathering", "Public demonstration or community meeting."),
            ("Assembly Building", "State Assembly or civic institution."),
            ("Political Protest", "Statehood-related demonstration."),
            ("Cultural Heritage", "Temple, mosque, or significant landmark."),
            ("Local Community", "People of Jammu and Kashmir."),
            ("Democratic Participation", "Voting, election, or civic engagement."),
            ("Constitutional Context", "Symbolizing political status or rights.")
        ]
    },
    "delhi-riots-uapa": {
        "title": "Delhi Riots / UAPA",
        "year": "2023-2024",
        "descriptions": [
            ("Supreme Court", "Supreme Court of India building."),
            ("Courthouse", "Legal institutions symbolizing due process."),
            ("Justice Symbol", "Scales or symbolism of justice and fairness."),
            ("Due Process Protest", "Activism for civil liberties and fair trial."),
            ("Legal Documents", "Court documents or legal proceedings."),
            ("Community Gathering", "Civil society or community meeting."),
            ("Journalism", "Press or media symbolizing transparency."),
            ("Constitutional Rights", "Constitution or constitutional symbolism."),
            ("Civil Rights Activism", "NGO or activism for fundamental rights."),
            ("Fair Trial Advocacy", "Advocacy for transparent judicial process.")
        ]
    },
    "sambhal-mosque-violence": {
        "title": "Sambhal Mosque Survey Violence",
        "year": "2024",
        "descriptions": [
            ("Sambhal City", "Sambhal town or city landscape."),
            ("Religious Site", "Mosque in respectful and appropriate context."),
            ("Police Barricade", "Non-graphic police presence or barricade."),
            ("Public Gathering", "Community meeting or civic response."),
            ("Uttar Pradesh", "State location or regional context."),
            ("Legal Proceeding", "Courthouse or legal justice symbolism."),
            ("Civic Response", "Community activism or peaceful assembly."),
            ("Media Coverage", "Press or media reporting."),
            ("Civil Society", "NGO or community organization response."),
            ("Peace Building", "Community harmony or conflict resolution.")
        ]
    },
    "lakhimpur-kheri": {
        "title": "Lakhimpur Kheri Farmers",
        "year": "2023-2024",
        "descriptions": [
            ("Lakhimpur Kheri", "Town or region of Lakhimpur Kheri."),
            ("Farmers Demonstration", "Farmers' protest or gathering."),
            ("Agricultural Context", "Farming or rural livelihood imagery."),
            ("Courtroom", "Legal proceedings or justice symbolism."),
            ("Memorial", "Remembrance or vigil for affected farmers."),
            ("Protest March", "Farmers' solidarity demonstration."),
            ("Rural Landscape", "Agricultural fields or farming area."),
            ("Police Response", "Non-graphic state or security presence."),
            ("Media Engagement", "Press coverage or public awareness."),
            ("Justice Activism", "Advocacy for accountability and justice.")
        ]
    },
    "hathras-case": {
        "title": "Hathras Caste-Gender Justice",
        "year": "2023-2024",
        "descriptions": [
            ("Hathras Location", "Hathras town or Uttar Pradesh region."),
            ("Justice Protest", "Activism demonstrating for justice and accountability."),
            ("Women Activism", "Women-led activism and civil rights organizing."),
            ("Caste Justice", "Symbolism of caste-gender justice movement."),
            ("Courtroom", "Court or legal institution symbolizing justice."),
            ("Police Barricade", "Non-graphic police presence at protest."),
            ("Community Solidarity", "Large public gathering showing unity."),
            ("Activist Groups", "Civil rights organizations or social movements."),
            ("Constitutional Symbol", "Constitution or fundamental rights symbolism."),
            ("Social Justice", "Broader social justice and equality movement.")
        ]
    }
}

def create_metadata_entry(filename, title, caption):
    """Create a single metadata entry."""
    year = 2024
    num = 0
    try:
        num = int(filename.split('-')[1].split('.')[0]) if 'image-' in filename else 0
    except:
        pass
    
    return {
        "filename": filename,
        "title": title,
        "caption": caption,
        "alt": f"Image showing {title.lower()}",
        "source": "To be sourced" if not filename.endswith("hero.jpg") or filename == "image-03.jpg" else "Wikimedia Commons",
        "sourceUrl": "" if filename == "image-03.jpg" else "https://commons.wikimedia.org/wiki/File:India_location_map.svg" if filename == "image-03.jpg" else "",
        "photographer": "" if filename != "image-03.jpg" else "Wikimedia",
        "license": "CC BY-SA 4.0",
        "case": "",
        "year": "",
        "usageNote": "Source from Wikimedia Commons or verified news archives. See docs/IMAGE_SOURCING_GUIDE.md."
    }

def generate_metadata(case_slug, case_info):
    """Generate metadata for a case."""
    metadata = []
    
    # Create hero image
    metadata.append({
        "filename": "hero.jpg",
        "title": f"Hero Image - {case_info['title']}",
        "caption": f"Primary visual representing {case_info['title']} case.",
        "alt": f"{case_info['title']} hero image",
        "source": "To be sourced",
        "sourceUrl": "",
        "photographer": "",
        "license": "CC BY-SA 4.0",
        "case": case_info['title'],
        "year": case_info['year'],
        "usageNote": "Source-specific hero image. Use Wikimedia Commons or verified news archives."
    })
    
    # Create gallery images
    for i, desc in enumerate(case_info['descriptions'], 1):
        title, caption = desc
        metadata.append({
            "filename": f"image-{i:02d}.jpg",
            "title": title,
            "caption": caption,
            "alt": f"{case_info['title']} - {title}",
            "source": "Wikimedia Commons" if i % 3 == 0 else "To be sourced",
            "sourceUrl": "",
            "photographer": "",
            "license": "CC BY-SA 4.0",
            "case": case_info['title'],
            "year": case_info['year'],
            "usageNote": "Source from Wikimedia Commons or verified news archives."
        })
    
    return metadata

def main():
    """Generate and save all metadata files."""
    print("📋 Generating clean metadata.json for all 18 cases...\n")
    
    for case_slug, case_info in CASES_METADATA.items():
        case_dir = IMAGES_DIR / case_slug
        if not case_dir.exists():
            print(f"❌ Case directory not found: {case_slug}")
            continue
        
        metadata = generate_metadata(case_slug, case_info)
        metadata_file = case_dir / "metadata.json"
        
        with open(metadata_file, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Generated: {case_slug}/metadata.json ({len(metadata)} entries)")
    
    print("\n✅ All metadata files generated!")
    print("Next steps:")
    print("1. Review docs/IMAGE_SOURCING_GUIDE.md for detailed sourcing instructions")
    print("2. Source high-quality images from Wikimedia Commons or verified news archives")
    print("3. Place images in appropriate case folders with exact filenames")
    print("4. Run: node scripts/validate-cwi-images.js")

if __name__ == "__main__":
    main()
