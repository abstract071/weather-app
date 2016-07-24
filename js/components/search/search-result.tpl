<% var id = cityElement.cityName.replace(/\s+/g, '') %>

<li>
    <span class="city-weather icon-<%- cityElement.icon %>"></span>
    <% var degrees = { celsius: cityElement.convertToCelsius(cityElement.temperature), fahrenheit: Math.round(cityElement.temperature) } %>
    <span class="city-temperature" data-fahrenheit="<%= degrees.fahrenheit %>" data-celsius="<%= degrees.celsius %>"><%- degrees[typeOfDegrees] %></span>
    <div>
        <span class="city-text"><%- cityElement.cityName %></span>
        <span class="city-state-text">//<%- cityElement.summary %></span>
    </div>
    <% if (!isChecked) { %>
    <input type="checkbox" id="<%- id %>"/>
    <label for="<%- id %>"><span class="icon-check"></span></label>
    <% } %>
</li>

