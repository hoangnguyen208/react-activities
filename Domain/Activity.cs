using System;
using System.Collections.Generic;

namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        
        // add virtual in navigation property for lazy loading (no need method 'includes' in EF core)
        public virtual ICollection<UserActivity> UserActivities { get; set; }
    }
}