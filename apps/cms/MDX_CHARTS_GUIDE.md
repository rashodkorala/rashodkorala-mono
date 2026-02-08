# Using Charts in MDX Case Studies

You **CAN** use React charts in your case studies! Charts from `recharts` are now available in your MDX content.

## Available Chart Components

All Recharts components are available:
- `LineChart`, `Line`
- `BarChart`, `Bar`
- `AreaChart`, `Area`
- `PieChart`, `Pie`
- `XAxis`, `YAxis`
- `Tooltip`, `Legend`
- `ResponsiveContainer`
- `CartesianGrid`

## How to Use Charts

**Important:** With `next-mdx-remote`, you must define data **inline** in your chart components. You cannot use separate variables or exports.

### Define Data Inline

Put your data directly in the chart component:

```jsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={[
    { stage: 'Creation', records: 1 },
    { stage: 'First Sale', records: 2 },
    { stage: 'Exhibition', records: 4 },
    { stage: 'Transport', records: 6 },
    { stage: 'Secondary Sale', records: 7 }
  ]}>
    <XAxis dataKey="stage" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="records" stroke="#555" />
  </LineChart>
</ResponsiveContainer>
```

## Complete Examples

### Line Chart

```jsx
## Sales Trend

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={[
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 7000 },
    { month: 'May', sales: 6000 }
  ]}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
```

### Bar Chart

```jsx
## Performance Comparison

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={[
    { metric: 'Speed', before: 85, after: 95 },
    { metric: 'Accuracy', before: 78, after: 92 },
    { metric: 'Reliability', before: 88, after: 96 }
  ]}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="metric" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="before" fill="#8884d8" name="Before" />
    <Bar dataKey="after" fill="#82ca9d" name="After" />
  </BarChart>
</ResponsiveContainer>
```

### Multiple Lines

```jsx
## Method Comparison Over Time

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={[
    { year: '2020', method1: 65, method2: 45 },
    { year: '2021', method1: 70, method2: 52 },
    { year: '2022', method1: 75, method2: 58 },
    { year: '2023', method1: 82, method2: 65 }
  ]}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="year" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="method1" stroke="#8884d8" name="Method 1" />
    <Line type="monotone" dataKey="method2" stroke="#82ca9d" name="Method 2" />
  </LineChart>
</ResponsiveContainer>
```

## Styling Tips

### Colors
Use hex colors for consistency:
- Primary: `#8884d8`
- Success: `#82ca9d`
- Warning: `#ffc658`
- Danger: `#ff7c7c`
- Neutral: `#555`

### Sizes
Recommended heights:
- Small chart: `height={200}`
- Medium chart: `height={300}`
- Large chart: `height={400}`

### Responsive Container
Always wrap charts in `ResponsiveContainer` for proper sizing:
```jsx
<ResponsiveContainer width="100%" height={300}>
  {/* Your chart here */}
</ResponsiveContainer>
```

## Common Patterns

### Chart with Grid and Legend

```jsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={[
    { x: 'A', y: 10 },
    { x: 'B', y: 20 },
    { x: 'C', y: 15 }
  ]}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="x" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="y" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
```

### Stacked Bar Chart

```jsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={[
    { category: 'A', value1: 30, value2: 20 },
    { category: 'B', value1: 40, value2: 25 },
    { category: 'C', value1: 35, value2: 30 }
  ]}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="category" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value1" stackId="a" fill="#8884d8" />
    <Bar dataKey="value2" stackId="a" fill="#82ca9d" />
  </BarChart>
</ResponsiveContainer>
```

## Important Notes

1. **⚠️ Data MUST be inline**: With `next-mdx-remote`, you CANNOT use separate variables or exports. Put data directly in the `data={[...]}` prop.

2. **JSX syntax**: Charts use JSX, so make sure to use proper JSX syntax (e.g., `strokeDasharray` not `stroke-dasharray`).

3. **Self-closing tags**: Use self-closing tags where appropriate: `<XAxis />` not `<XAxis></XAxis>`.

4. **Height is required**: Always specify a height for ResponsiveContainer.

5. **Data structure**: Each data object should have consistent keys that match the `dataKey` props in your chart components.

6. **No imports needed**: Chart components are already available - just use them directly.

## Troubleshooting

### Chart not showing?
- Make sure your data is **inline** in the `data={[...]}` prop
- Check that ResponsiveContainer has a height
- Verify data structure matches dataKey props

### "conditionData is not defined" error?
- ❌ Don't use: `export const conditionData = [...]`
- ✅ Do use: `data={[...]}` inline in the component
- This is a limitation of `next-mdx-remote`

### Syntax error?
- Check for unescaped curly braces outside the chart
- Ensure all JSX tags are properly closed
- Use JSX property names (camelCase)

### Chart looks wrong?
- Check data structure
- Verify dataKey matches your data object keys
- Try adding CartesianGrid for better visibility

## Full Working Example

Here's your artwork condition reporting chart, ready to use:

```jsx
## Condition History Accumulation

As condition reports accumulate, authenticity confidence increases through repeatable physical verification.

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={[
    { stage: 'Creation', records: 1 },
    { stage: 'First Sale', records: 2 },
    { stage: 'Exhibition', records: 4 },
    { stage: 'Transport', records: 6 },
    { stage: 'Secondary Sale', records: 7 }
  ]}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="stage" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="records" stroke="#555" name="Condition Reports" />
  </LineChart>
</ResponsiveContainer>
```

This will render a line chart showing how condition reports accumulate across the artwork's lifecycle!

**Remember:** Always put data inline - no separate variables!



