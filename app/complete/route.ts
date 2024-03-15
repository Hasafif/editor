import { NextResponse } from "next/server";
import axios from "axios";
import { resolve } from "path";

const API_BASE_URL = 'http://127.0.0.1:8000';
export async function POST(request: Request) {
    const { textTocomplete } = await request.json();
    const statement = textTocomplete
    const response = await axios.post(`${API_BASE_URL}/complete/`, { statement});
    console.log(response);
    return NextResponse.json({ aiPrompt: response.data });}