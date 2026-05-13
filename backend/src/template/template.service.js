import path from "path";
import fs from "fs";

export function getFacilityImportTemplate() {
    const filePath = path.join(
        process.cwd(),
        "storage",
        "templates",
        "FacilityTemplate.xls"
    );

    if(!fs.existsSync(filePath)) {
        throw new Error("Template file not found")
    }

    return {
        path: filePath,
        downloadName: "FacilityTemplate.xls"
    }
}
export function getBuildingImportTemplate() {
    const filePath = path.join(
        process.cwd(),
        "storage",
        "templates",
        "BuildingTemplate.xls"
    );

    if(!fs.existsSync(filePath)) {
        throw new Error("Template file not found")
    }

    return {
        path: filePath,
        downloadName: "BuildingTemplate.xls"
    }
}

export function getFloorImportTemplate() {
    const filePath = path.join(
        process.cwd(),
        "storage",
        "templates",
        "FloorTemplate.xls"
    );

    if(!fs.existsSync(filePath)) {
        throw new Error("Template file not found")
    }

    return {
        path: filePath,
        downloadName: "FloorTemplate.xls"
    }
}

export function getRoomImportTemplate() {
    const filePath = path.join(
        process.cwd(),
        "storage",
        "templates",
        "RoomTemplate.xls"
    );

    if(!fs.existsSync(filePath)) {
        throw new Error("Template file not found")
    }

    return {
        path: filePath,
        downloadName: "RoomTemplate.xls"
    }
}

