export function classifyImageFromName(fileName = "") {
  const lowerName = fileName.toLowerCase();

  let garmentType = "Unknown";
  let style = "Unknown";
  let material = "Unknown";
  let colorPalette = "Unknown";
  let pattern = "Unknown";
  let occasion = "Unknown";
  let trendNotes = "Auto-classified from filename keywords";
  let description = `AI-generated description for ${fileName}`;

  if (lowerName.includes("dress")) {
    garmentType = "Dress";
  } else if (lowerName.includes("jacket")) {
    garmentType = "Jacket";
  } else if (lowerName.includes("coat")) {
    garmentType = "Coat";
  } else if (lowerName.includes("blazer")) {
    garmentType = "Blazer";
  } else if (lowerName.includes("shirt")) {
    garmentType = "Shirt";
  } else if (lowerName.includes("pants")) {
    garmentType = "Pants";
  }

  if (lowerName.includes("street")) {
    style = "Streetwear";
  } else if (lowerName.includes("minimal")) {
    style = "Minimal";
  } else if (lowerName.includes("tailored")) {
    style = "Tailored";
  } else if (lowerName.includes("boho") || lowerName.includes("bohemian")) {
    style = "Bohemian";
  }

  if (lowerName.includes("denim")) {
    material = "Denim";
  } else if (lowerName.includes("linen")) {
    material = "Linen";
  } else if (lowerName.includes("wool")) {
    material = "Wool Blend";
  } else if (lowerName.includes("cotton")) {
    material = "Cotton Blend";
  }

  if (lowerName.includes("blue")) {
    colorPalette = "Blue";
  } else if (lowerName.includes("black")) {
    colorPalette = "Black";
  } else if (lowerName.includes("white")) {
    colorPalette = "White";
  } else if (lowerName.includes("beige")) {
    colorPalette = "Beige";
  } else if (lowerName.includes("red")) {
    colorPalette = "Red";
  }

  if (lowerName.includes("floral")) {
    pattern = "Floral";
  } else if (lowerName.includes("striped")) {
    pattern = "Striped";
  } else if (lowerName.includes("solid")) {
    pattern = "Solid";
  }

  if (lowerName.includes("work") || lowerName.includes("office")) {
    occasion = "Work";
  } else if (lowerName.includes("party")) {
    occasion = "Party";
  } else if (lowerName.includes("casual")) {
    occasion = "Casual";
  } else if (lowerName.includes("vacation")) {
    occasion = "Vacation";
  }

  description = `${colorPalette} ${material} ${garmentType}`
    .replace(/\bUnknown\b/g, "")
    .trim();

  if (!description) {
    description = `AI-generated description for ${fileName}`;
  } else {
    description = `${description} with ${style.toLowerCase()} styling`.replace(
      "unknown styling",
      "versatile styling",
    );
  }

  return {
    garmentType,
    style,
    material,
    colorPalette,
    pattern,
    occasion,
    trendNotes,
    description,
  };
}
