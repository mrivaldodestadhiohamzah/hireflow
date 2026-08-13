using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<HireFlowDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks().AddDbContextCheck<HireFlowDbContext>();
builder.Services.AddCors(options => options.AddPolicy("web", policy => policy
    .WithOrigins(builder.Configuration["AllowedOrigins"]?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? [])
    .AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("web");
app.MapHealthChecks("/health");
app.MapGet("/api/jobs", async (HireFlowDbContext db) => await db.Jobs.AsNoTracking().OrderByDescending(job => job.CreatedAt).ToListAsync());
app.MapGet("/api/candidates", async (HireFlowDbContext db) => await db.Candidates.AsNoTracking().OrderBy(candidate => candidate.Name).ToListAsync());
app.MapPost("/api/jobs", async (Job job, HireFlowDbContext db) => {
    if (string.IsNullOrWhiteSpace(job.Title) || string.IsNullOrWhiteSpace(job.Department)) return Results.ValidationProblem(new Dictionary<string, string[]> { ["job"] = ["Title and department are required."] });
    job.Id = Guid.NewGuid(); job.CreatedAt = DateTimeOffset.UtcNow; db.Jobs.Add(job); await db.SaveChangesAsync(); return Results.Created($"/api/jobs/{job.Id}", job);
});
app.Run();

public sealed class HireFlowDbContext(DbContextOptions<HireFlowDbContext> options) : DbContext(options) {
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<Candidate> Candidates => Set<Candidate>();
}
public sealed class Job { public Guid Id { get; set; } public string Title { get; set; } = ""; public string Department { get; set; } = ""; public string Location { get; set; } = ""; public string Status { get; set; } = "Draft"; public DateTimeOffset CreatedAt { get; set; } }
public sealed class Candidate { public Guid Id { get; set; } public string Name { get; set; } = ""; public string Email { get; set; } = ""; public string Stage { get; set; } = "Applied"; }
