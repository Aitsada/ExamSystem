import db from "../config/db.js";

export async function findAll() {
  const [result] = await db.query("SELECT * FROM Organization");
  return result;
}

export async function findById(id) {
  const [result] = await db.query("SELECT * FROM Organization WHERE ID = ?", [
    id,
  ]);
  return result[0];
}
export async function create(data) {
  const [result] = await db.query(
    `
    INSERT INTO Organization
    (
      Name,
      Description,
      CreatedBy,
      Logo,
      LogoMimeType,
      LogoOriginalName,
      LogoSize
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.Name,
      data.Description,
      data.CreatedBy ?? "Ait",
      data.Logo ?? null,
      data.LogoMimeType ?? null,
      data.LogoOriginalName ?? null,
      data.LogoSize ?? null,
    ],
  );

  return result;
}
export async function update(id, data) {
  const [result] = await db.query(
    "UPDATE Organization SET Name = COALESCE(?, Name), Description = COALESCE(?, Description) WHERE ID = ?",
    [data.Name ?? null, data.Description ?? null, id],
  );
  return result;
}

// Upload LOGO file

export async function findLogoById(id) {
  const [rows] = await db.query(
    `
    SELECT Logo, LogoMimeType
    FROM Organization
    WHERE ID = ?
    `,
    [id],
  );

  return rows[0] || null;
}

export async function updateLogo(id, data) {
  const [result] = await db.query(
    `
    UPDATE Organization
    SET
      Logo = ?,
      LogoMimeType = ?,
      LogoOriginalName = ?,
      LogoSize = ?,
      LastModifiedBy = ?
    WHERE ID = ?
    `,
    [
      data.Logo,
      data.LogoMimeType,
      data.LogoOriginalName,
      data.LogoSize,
      data.LastModifiedBy ?? null,
      id,
    ],
  );

  return result.affectedRows;
}