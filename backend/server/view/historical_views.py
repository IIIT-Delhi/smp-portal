import json
from datetime import datetime, date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from server.models import *


@csrf_exempt
def get_historical_data(request):
    """
    Get historical data for mentors and mentees from the last 5 years.
    
    Args:
        request: HTTP request object
            Method: GET or POST
            Query params (GET) or Body (POST):
                - years (int, optional): Number of years to fetch (default: 5)
                - user_type (str, optional): Filter by user type ('mentor', 'mentee', 'candidate')
                - department (str, optional): Filter by department
                - academic_year (str, optional): Filter by specific academic year
    
    Returns:
        JsonResponse: Historical data grouped by academic year and user type
    """
    try:
        if request.method == "GET":
            years = int(request.GET.get('years', 5))
            user_type = request.GET.get('user_type')
            department = request.GET.get('department')
            academic_year = request.GET.get('academic_year')
        else:  # POST
            data = json.loads(request.body.decode('utf-8'))
            years = data.get('years', 5)
            user_type = data.get('user_type')
            department = data.get('department')
            academic_year = data.get('academic_year')
        
        # Build query
        query = HistoricalData.objects.all()
        
        if academic_year:
            query = query.filter(academic_year=academic_year)
        else:
            # Get recent years
            recent_years = AcademicYear.objects.order_by('-year')[:years]
            year_list = [year.year for year in recent_years]
            query = query.filter(academic_year__in=year_list)
        
        if user_type:
            query = query.filter(user_type=user_type)
        
        if department:
            query = query.filter(department=department)
        
        # Get the data and group it
        historical_data = query.order_by('-academic_year', 'user_type', 'name')
        
        # Group by academic year and user type
        grouped_data = {}
        for record in historical_data:
            year = record.academic_year
            u_type = record.user_type
            
            if year not in grouped_data:
                grouped_data[year] = {}
            
            if u_type not in grouped_data[year]:
                grouped_data[year][u_type] = []
            
            record_data = {
                'id': record.user_id,
                'name': record.name,
                'email': record.email,
                'department': record.department,
                'contact': record.contact,
                'imgSrc': record.imgSrc,
                'archived_at': record.archived_at.isoformat() if record.archived_at else None
            }
            
            # Add specific fields based on user type
            if record.user_type == 'mentor' or record.user_type == 'candidate':
                record_data.update({
                    'year': record.year,
                    'score': record.score,
                    'status': record.status,
                    'size': record.size,
                    'remarks': record.remarks
                })
            elif record.user_type == 'mentee':
                record_data.update({
                    'mentorId': record.mentorId,
                    'first_login_completed': record.first_login_completed
                })
            
            grouped_data[year][u_type].append(record_data)
        
        # Get summary statistics
        stats = {}
        for year in grouped_data:
            stats[year] = {}
            for u_type in grouped_data[year]:
                stats[year][u_type + '_count'] = len(grouped_data[year][u_type])
        
        return JsonResponse({
            'historical_data': grouped_data,
            'statistics': stats,
            'total_years': len(grouped_data),
            'available_years': list(grouped_data.keys())
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def archive_current_data(request):
    """
    Archive current mentors and mentees to historical data table.
    This should be called before uploading new batches.
    
    Args:
        request: HTTP request object
            Method: POST
            Body (JSON):
                - academic_year (str): Academic year for archiving (e.g., "2024-2025")
                - semester (str, optional): "Odd" or "Even" (default: "Even")
                - archived_by (str, optional): Admin who is archiving
                - clear_current (bool, optional): Whether to clear current tables after archiving (default: False)
    
    Returns:
        JsonResponse: Success message with counts of archived records
    """
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
    try:
        data = json.loads(request.body.decode('utf-8'))
        academic_year = data.get('academic_year')
        semester = data.get('semester', 'Even')
        archived_by = data.get('archived_by', 'System')
        clear_current = data.get('clear_current', False)
        
        if not academic_year:
            return JsonResponse({'error': 'Academic year is required'}, status=400)
        
        archived_counts = {
            'mentors': 0,
            'mentees': 0,
            'candidates': 0
        }
        
        with transaction.atomic():
            # Archive Mentors (Candidates with status 5)
            mentors = Candidate.objects.filter(status=5)
            for mentor in mentors:
                HistoricalData.objects.create(
                    academic_year=academic_year,
                    semester=semester,
                    user_type='mentor',
                    user_id=mentor.id,
                    name=mentor.name,
                    email=mentor.email,
                    department=mentor.department,
                    contact=mentor.contact,
                    imgSrc=mentor.imgSrc,
                    year=mentor.year,
                    score=mentor.score,
                    status=mentor.status,
                    size=mentor.size,
                    remarks=mentor.remarks,
                    archived_by=archived_by
                )
                archived_counts['mentors'] += 1
            
            # Archive Candidates (not mentors)
            candidates = Candidate.objects.exclude(status=5)
            for candidate in candidates:
                HistoricalData.objects.create(
                    academic_year=academic_year,
                    semester=semester,
                    user_type='candidate',
                    user_id=candidate.id,
                    name=candidate.name,
                    email=candidate.email,
                    department=candidate.department,
                    contact=candidate.contact,
                    imgSrc=candidate.imgSrc,
                    year=candidate.year,
                    score=candidate.score,
                    status=candidate.status,
                    size=candidate.size,
                    remarks=candidate.remarks,
                    archived_by=archived_by
                )
                archived_counts['candidates'] += 1
            
            # Archive Mentees
            mentees = Mentee.objects.all()
            for mentee in mentees:
                HistoricalData.objects.create(
                    academic_year=academic_year,
                    semester=semester,
                    user_type='mentee',
                    user_id=mentee.id,
                    name=mentee.name,
                    email=mentee.email,
                    department=mentee.department,
                    contact=mentee.contact,
                    imgSrc=mentee.imgSrc,
                    mentorId=mentee.mentorId,
                    first_login_completed=mentee.first_login_completed,
                    archived_by=archived_by
                )
                archived_counts['mentees'] += 1
            
            # Create or update academic year record
            academic_year_obj, created = AcademicYear.objects.get_or_create(
                year=academic_year,
                defaults={
                    'start_date': date.today(),
                    'end_date': date.today().replace(year=date.today().year + 1),
                    'is_current': False
                }
            )
            
            # If requested, clear current tables
            if clear_current:
                Candidate.objects.all().delete()
                Mentee.objects.all().delete()
                # Also clear related data
                Meetings.objects.all().delete()
                Attendance.objects.all().delete()
                FormResponses.objects.all().delete()
        
        return JsonResponse({
            'message': 'Data archived successfully',
            'archived_counts': archived_counts,
            'academic_year': academic_year,
            'semester': semester,
            'total_archived': sum(archived_counts.values())
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def get_academic_years(request):
    """
    Get list of all academic years.
    
    Returns:
        JsonResponse: List of academic years with their details
    """
    try:
        years = AcademicYear.objects.all().order_by('-year')
        
        years_data = []
        for year in years:
            years_data.append({
                'id': year.id,
                'year': year.year,
                'start_date': year.start_date.isoformat() if year.start_date else None,
                'end_date': year.end_date.isoformat() if year.end_date else None,
                'is_current': year.is_current,
                'created_at': year.created_at.isoformat() if year.created_at else None
            })
        
        return JsonResponse({
            'academic_years': years_data,
            'total_count': len(years_data)
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def get_historical_statistics(request):
    """
    Get statistical summary of historical data.
    
    Returns:
        JsonResponse: Statistics grouped by year, department, and user type
    """
    try:
        # Get data from the last 5 years
        recent_years = AcademicYear.objects.order_by('-year')[:5]
        year_list = [year.year for year in recent_years]
        
        historical_data = HistoricalData.objects.filter(academic_year__in=year_list)
        
        # Statistics by year and type
        stats_by_year = {}
        stats_by_department = {}
        
        for record in historical_data:
            year = record.academic_year
            dept = record.department
            user_type = record.user_type
            
            # Stats by year
            if year not in stats_by_year:
                stats_by_year[year] = {'mentors': 0, 'mentees': 0, 'candidates': 0, 'total': 0}
            
            stats_by_year[year][user_type] += 1
            stats_by_year[year]['total'] += 1
            
            # Stats by department
            if dept not in stats_by_department:
                stats_by_department[dept] = {'mentors': 0, 'mentees': 0, 'candidates': 0, 'total': 0}
            
            stats_by_department[dept][user_type] += 1
            stats_by_department[dept]['total'] += 1
        
        return JsonResponse({
            'statistics_by_year': stats_by_year,
            'statistics_by_department': stats_by_department,
            'total_records': historical_data.count(),
            'years_covered': len(stats_by_year)
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
