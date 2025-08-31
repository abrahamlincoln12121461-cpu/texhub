import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Calendar, Clock, User, Settings, Layers, Droplets, Shirt, Target, BarChart3, AlertTriangle, Award, Wrench, Thermometer, Beaker, Gauge, Package, Scissors, BedDouble as Needle, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { TypedMemoryInput } from './TypedMemoryInput';
import { 
  ProductionEntry, 
  KnittingProductionEntry, 
  DyeingProductionEntry, 
  GarmentsProductionEntry,
  SHIFTS,
  FABRIC_TYPES,
  DYE_TYPES,
  YARN_TYPES,
  GARMENT_STYLES,
  GARMENT_SIZES,
  QUALITY_GRADES,
  initialKnittingEntry,
  initialDyeingEntry,
  initialGarmentsEntry
} from '../types/production';
import * as Select from '@radix-ui/react-select';

interface ProductionDataEntryProps {
  productionType: 'knitting' | 'dyeing' | 'garments';
  onSave: (entry: Omit<ProductionEntry, 'id' | 'userId' | 'timestamp'>) => void;
  editingEntry?: ProductionEntry | null;
  onCancel: () => void;
}

export const ProductionDataEntry: React.FC<ProductionDataEntryProps> = ({
  productionType,
  onSave,
  editingEntry,
  onCancel
}) => {
  const [formData, setFormData] = useState<any>(() => {
    if (editingEntry) return editingEntry;
    
    switch (productionType) {
      case 'knitting': return initialKnittingEntry;
      case 'dyeing': return initialDyeingEntry;
      case 'garments': return initialGarmentsEntry;
      default: return initialKnittingEntry;
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingEntry) {
      setFormData(editingEntry);
    } else {
      switch (productionType) {
        case 'knitting':
          setFormData(initialKnittingEntry);
          break;
        case 'dyeing':
          setFormData(initialDyeingEntry);
          break;
        case 'garments':
          setFormData(initialGarmentsEntry);
          break;
      }
    }
    setErrors({});
  }, [productionType, editingEntry]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate efficiency for knitting and garments
      if (productionType === 'knitting' && (field === 'actualProduction' || field === 'targetProduction')) {
        const actual = field === 'actualProduction' ? Number(value) : newData.actualProduction;
        const target = field === 'targetProduction' ? Number(value) : newData.targetProduction;
        if (target > 0) {
          newData.efficiency = Math.round((actual / target) * 100);
        }
      }
      
      if (productionType === 'garments' && (field === 'completedQuantity' || field === 'targetQuantity')) {
        const completed = field === 'completedQuantity' ? Number(value) : newData.completedQuantity;
        const target = field === 'targetQuantity' ? Number(value) : newData.targetQuantity;
        if (target > 0) {
          newData.efficiency = Math.round((completed / target) * 100);
        }
      }
      
      // Auto-calculate total hours
      if (field === 'startTime' || field === 'endTime') {
        const start = field === 'startTime' ? value : newData.startTime;
        const end = field === 'endTime' ? value : newData.endTime;
        if (start && end) {
          const startTime = new Date(`2000-01-01T${start}`);
          const endTime = new Date(`2000-01-01T${end}`);
          if (endTime > startTime) {
            newData.totalHours = Math.round(((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)) * 10) / 10;
          }
        }
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDefectChange = (defectType: string, value: number) => {
    setFormData((prev: any) => ({
      ...prev,
      defects: {
        ...prev.defects,
        [defectType]: value
      }
    }));
  };

  const handleOperationChange = (operation: string, value: number) => {
    setFormData((prev: any) => ({
      ...prev,
      operations: {
        ...prev.operations,
        [operation]: value
      }
    }));
  };

  const handleChemicalConsumptionChange = (chemical: string, value: number) => {
    setFormData((prev: any) => ({
      ...prev,
      chemicalConsumption: {
        ...prev.chemicalConsumption,
        [chemical]: value
      }
    }));
  };

  const handleQualityResultChange = (aspect: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      qualityResults: {
        ...prev.qualityResults,
        [aspect]: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Common validations
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.operator?.trim()) newErrors.operator = 'Operator name is required';
    if (!formData.supervisor?.trim()) newErrors.supervisor = 'Supervisor name is required';
    if (!formData.machineNo?.trim()) newErrors.machineNo = 'Machine number is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    
    // Type-specific validations
    if (productionType === 'knitting') {
      if (!formData.fabricType?.trim()) newErrors.fabricType = 'Fabric type is required';
      if (!formData.yarnType?.trim()) newErrors.yarnType = 'Yarn type is required';
      if (formData.targetProduction <= 0) newErrors.targetProduction = 'Target production must be greater than 0';
    }
    
    if (productionType === 'dyeing') {
      if (!formData.fabricType?.trim()) newErrors.fabricType = 'Fabric type is required';
      if (!formData.color?.trim()) newErrors.color = 'Color is required';
      if (!formData.dyeType?.trim()) newErrors.dyeType = 'Dye type is required';
      if (formData.batchWeight <= 0) newErrors.batchWeight = 'Batch weight must be greater than 0';
    }
    
    if (productionType === 'garments') {
      if (!formData.style?.trim()) newErrors.style = 'Style is required';
      if (!formData.size?.trim()) newErrors.size = 'Size is required';
      if (!formData.color?.trim()) newErrors.color = 'Color is required';
      if (formData.targetQuantity <= 0) newErrors.targetQuantity = 'Target quantity must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const inputClasses = "w-full rounded-xl border border-border shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background text-foreground py-3 px-4 transition-all duration-200 hover:border-primary/50";
  const labelClasses = "block text-sm font-semibold text-foreground mb-2";
  const errorClasses = "text-red-500 text-xs mt-1";
  const sectionClasses = "bg-card p-8 rounded-2xl border border-border shadow-lg";
  const sectionHeaderClasses = "flex items-center gap-3 mb-6 pb-4 border-b border-border";

  const SelectItemContent = ({ children, value }: { children: React.ReactNode; value: string }) => (
    <Select.Item
      value={value}
      className="relative flex items-center rounded-lg py-3 pl-4 pr-12 text-foreground text-sm outline-none data-[highlighted]:bg-primary/20 transition-colors cursor-pointer"
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );

  const getProductionIcon = () => {
    switch (productionType) {
      case 'knitting': return <Layers className="h-8 w-8 text-white" />;
      case 'dyeing': return <Droplets className="h-8 w-8 text-white" />;
      case 'garments': return <Shirt className="h-8 w-8 text-white" />;
    }
  };

  const getProductionColor = () => {
    switch (productionType) {
      case 'knitting': return 'from-blue-500 to-blue-600';
      case 'dyeing': return 'from-purple-500 to-purple-600';
      case 'garments': return 'from-green-500 to-green-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-2xl border border-border/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`p-4 bg-gradient-to-br ${getProductionColor()} rounded-2xl shadow-lg`}>
              {getProductionIcon()}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground capitalize">
                {productionType} Production Entry
              </h2>
              <p className="text-muted-foreground text-lg mt-1">
                {editingEntry ? 'Edit existing production data' : 'Record new production data for today'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Entry
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Basic Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={sectionClasses}
      >
        <div className={sectionHeaderClasses}>
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Basic Information</h3>
            <p className="text-muted-foreground">General production details and timing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className={labelClasses}>
              <Calendar className="inline h-4 w-4 mr-2" />
              Production Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={inputClasses}
            />
            {errors.date && <p className={errorClasses}>{errors.date}</p>}
          </div>

          <div>
            <label className={labelClasses}>
              <Clock className="inline h-4 w-4 mr-2" />
              Shift *
            </label>
            <Select.Root value={formData.shift} onValueChange={(value) => handleInputChange('shift', value)}>
              <Select.Trigger className={inputClasses}>
                <Select.Value placeholder="Select Shift" />
                <Select.Icon>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden rounded-xl bg-card border border-border shadow-2xl z-50">
                  <Select.Viewport className="p-2">
                    {SHIFTS.map(shift => (
                      <SelectItemContent key={shift.value} value={shift.value}>
                        {shift.label}
                      </SelectItemContent>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            {errors.shift && <p className={errorClasses}>{errors.shift}</p>}
          </div>

          <div>
            <label className={labelClasses}>
              <Clock className="inline h-4 w-4 mr-2" />
              Start Time *
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className={inputClasses}
            />
            {errors.startTime && <p className={errorClasses}>{errors.startTime}</p>}
          </div>

          <div>
            <label className={labelClasses}>
              <Clock className="inline h-4 w-4 mr-2" />
              End Time *
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className={inputClasses}
            />
            {errors.endTime && <p className={errorClasses}>{errors.endTime}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className={labelClasses}>
              <User className="inline h-4 w-4 mr-2" />
              Operator *
            </label>
            <TypedMemoryInput
              value={formData.operator}
              onChange={(e) => handleInputChange('operator', e.target.value)}
              className={inputClasses}
              storageKey={`${productionType}Operator`}
              placeholder="Operator name"
            />
            {errors.operator && <p className={errorClasses}>{errors.operator}</p>}
          </div>

          <div>
            <label className={labelClasses}>
              <User className="inline h-4 w-4 mr-2" />
              Supervisor *
            </label>
            <TypedMemoryInput
              value={formData.supervisor}
              onChange={(e) => handleInputChange('supervisor', e.target.value)}
              className={inputClasses}
              storageKey={`${productionType}Supervisor`}
              placeholder="Supervisor name"
            />
            {errors.supervisor && <p className={errorClasses}>{errors.supervisor}</p>}
          </div>

          <div>
            <label className={labelClasses}>
              <Wrench className="inline h-4 w-4 mr-2" />
              Machine No *
            </label>
            <TypedMemoryInput
              value={formData.machineNo}
              onChange={(e) => handleInputChange('machineNo', e.target.value)}
              className={inputClasses}
              storageKey={`${productionType}MachineNo`}
              placeholder="Machine number"
            />
            {errors.machineNo && <p className={errorClasses}>{errors.machineNo}</p>}
          </div>
        </div>

        {/* Total Hours Display */}
        {formData.totalHours > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-border/50">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Total Working Hours: </span>
              <span className="text-xl font-bold text-primary">{formData.totalHours}h</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Production Specific Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={sectionClasses}
      >
        <div className={sectionHeaderClasses}>
          <div className={`p-3 bg-gradient-to-br ${getProductionColor()} rounded-xl`}>
            {productionType === 'knitting' && <Layers className="h-6 w-6 text-white" />}
            {productionType === 'dyeing' && <Beaker className="h-6 w-6 text-white" />}
            {productionType === 'garments' && <Scissors className="h-6 w-6 text-white" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground capitalize">
              {productionType} Production Details
            </h3>
            <p className="text-muted-foreground">
              {productionType === 'knitting' && 'Fabric production specifications and targets'}
              {productionType === 'dyeing' && 'Dyeing process parameters and quality metrics'}
              {productionType === 'garments' && 'Garment production details and operations'}
            </p>
          </div>
        </div>

        {/* Knitting Specific Fields */}
        {productionType === 'knitting' && (
          <div className="space-y-6">
            {/* Material & Specifications */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Material & Specifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>Fabric Type *</label>
                  <Select.Root value={formData.fabricType} onValueChange={(value) => handleInputChange('fabricType', value)}>
                    <Select.Trigger className={inputClasses}>
                      <Select.Value placeholder="Select Fabric Type" />
                      <Select.Icon>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-xl bg-card border border-border shadow-2xl z-50">
                        <Select.Viewport className="p-2 max-h-48 overflow-y-auto">
                          {FABRIC_TYPES.map(fabric => (
                            <SelectItemContent key={fabric} value={fabric}>{fabric}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.fabricType && <p className={errorClasses}>{errors.fabricType}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Yarn Type *</label>
                  <Select.Root value={formData.yarnType} onValueChange={(value) => handleInputChange('yarnType', value)}>
                    <Select.Trigger className={inputClasses}>
                      <Select.Value placeholder="Select Yarn Type" />
                      <Select.Icon>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-xl bg-card border border-border shadow-2xl z-50">
                        <Select.Viewport className="p-2 max-h-48 overflow-y-auto">
                          {YARN_TYPES.map(yarn => (
                            <SelectItemContent key={yarn} value={yarn}>{yarn}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.yarnType && <p className={errorClasses}>{errors.yarnType}</p>}
                </div>

                <div>
                  <label className={labelClasses}>
                    <Package className="inline h-4 w-4 mr-2" />
                    Yarn Lot
                  </label>
                  <TypedMemoryInput
                    value={formData.yarnLot}
                    onChange={(e) => handleInputChange('yarnLot', e.target.value)}
                    className={inputClasses}
                    storageKey="knittingYarnLot"
                    placeholder="Yarn lot number"
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    <Gauge className="inline h-4 w-4 mr-2" />
                    Gauge
                  </label>
                  <TypedMemoryInput
                    value={formData.gauge}
                    onChange={(e) => handleInputChange('gauge', e.target.value)}
                    className={inputClasses}
                    storageKey="knittingGauge"
                    placeholder="e.g., 28GG"
                  />
                </div>
              </div>
            </div>

            {/* Technical Parameters */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Technical Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>GSM</label>
                  <input
                    type="number"
                    value={formData.gsm || ''}
                    onChange={(e) => handleInputChange('gsm', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Grams per square meter"
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Width (cm)</label>
                  <input
                    type="number"
                    value={formData.width || ''}
                    onChange={(e) => handleInputChange('width', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Fabric width"
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className={labelClasses}>RPM</label>
                  <input
                    type="number"
                    value={formData.rpm || ''}
                    onChange={(e) => handleInputChange('rpm', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Revolutions per minute"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    <Needle className="inline h-4 w-4 mr-2" />
                    Needle Breaks
                  </label>
                  <input
                    type="number"
                    value={formData.needleBreaks || ''}
                    onChange={(e) => handleInputChange('needleBreaks', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Number of breaks"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Production Targets */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Production Targets & Results
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClasses}>Target Production (kg) *</label>
                  <input
                    type="number"
                    value={formData.targetProduction || ''}
                    onChange={(e) => handleInputChange('targetProduction', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Target production"
                    min="0"
                    step="any"
                  />
                  {errors.targetProduction && <p className={errorClasses}>{errors.targetProduction}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Actual Production (kg)</label>
                  <input
                    type="number"
                    value={formData.actualProduction || ''}
                    onChange={(e) => handleInputChange('actualProduction', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Actual production"
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    <BarChart3 className="inline h-4 w-4 mr-2" />
                    Efficiency (%)
                  </label>
                  <input
                    type="text"
                    value={`${formData.efficiency || 0}%`}
                    readOnly
                    className={`${inputClasses} bg-muted/30 font-bold text-primary`}
                  />
                </div>
              </div>
            </div>

            {/* Defects Tracking */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Defects Tracking
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>Holes</label>
                  <input
                    type="number"
                    value={formData.defects?.holes || ''}
                    onChange={(e) => handleDefectChange('holes', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Number of holes"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Drop Stitches</label>
                  <input
                    type="number"
                    value={formData.defects?.dropStitches || ''}
                    onChange={(e) => handleDefectChange('dropStitches', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Drop stitches count"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Yarn Breaks</label>
                  <input
                    type="number"
                    value={formData.defects?.yarnBreaks || ''}
                    onChange={(e) => handleDefectChange('yarnBreaks', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Yarn breaks count"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Other Defects</label>
                  <input
                    type="number"
                    value={formData.defects?.other || ''}
                    onChange={(e) => handleDefectChange('other', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Other defects"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dyeing Specific Fields */}
        {productionType === 'dyeing' && (
          <div className="space-y-6">
            {/* Material & Color */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Palette className="h-5 w-5 mr-2 text-primary" />
                Material & Color Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Fabric Type *</label>
                  <Select.Root value={formData.fabricType} onValueChange={(value) => handleInputChange('fabricType', value)}>
                    <Select.Trigger className={inputClasses}>
                      <Select.Value placeholder="Select Fabric Type" />
                      <Select.Icon>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-xl bg-card border border-border shadow-2xl z-50">
                        <Select.Viewport className="p-2 max-h-48 overflow-y-auto">
                          {FABRIC_TYPES.map(fabric => (
                            <SelectItemContent key={fabric} value={fabric}>{fabric}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.fabricType && <p className={errorClasses}>{errors.fabricType}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Color *</label>
                  <TypedMemoryInput
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className={inputClasses}
                    storageKey="dyeingColor"
                    placeholder="Color name"
                  />
                  {errors.color && <p className={errorClasses}>{errors.color}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Dye Type *</label>
                  <Select.Root value={formData.dyeType} onValueChange={(value) => handleInputChange('dyeType', value)}>
                    <Select.Trigger className={inputClasses}>
                      <Select.Value placeholder="Select Dye Type" />
                      <Select.Icon>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-xl bg-card border border-border shadow-2xl z-50">
                        <Select.Viewport className="p-2">
                          {DYE_TYPES.map(dye => (
                            <SelectItemContent key={dye} value={dye}>{dye}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.dyeType && <p className={errorClasses}>{errors.dyeType}</p>}
                </div>
              </div>
            </div>

            {/* Process Parameters */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-primary" />
                Process Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>Batch Weight (kg) *</label>
                  <input
                    type="number"
                    value={formData.batchWeight || ''}
                    onChange={(e) => handleInputChange('batchWeight', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Batch weight"
                    min="0"
                    step="any"
                  />
                  {errors.batchWeight && <p className={errorClasses}>{errors.batchWeight}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Liquor Ratio</label>
                  <input
                    type="number"
                    value={formData.liquorRatio || ''}
                    onChange={(e) => handleInputChange('liquorRatio', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="1:10"
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Temperature (°C)</label>
                  <input
                    type="number"
                    value={formData.temperature || ''}
                    onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Temperature"
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className={labelClasses}>pH Level</label>
                  <input
                    type="number"
                    value={formData.pH || ''}
                    onChange={(e) => handleInputChange('pH', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="pH level"
                    min="0"
                    max="14"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Chemical Consumption */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Beaker className="h-5 w-5 mr-2 text-primary" />
                Chemical Consumption (kg)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>Dyes</label>
                  <input
                    type="number"
                    value={formData.chemicalConsumption?.dyes || ''}
                    onChange={(e) => handleChemicalConsumptionChange('dyes', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Dyes used"
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Salt</label>
                  <input
                    type="number"
                    value={formData.chemicalConsumption?.salt || ''}
                    onChange={(e) => handleChemicalConsumptionChange('salt', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Salt used"
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Soda</label>
                  <input
                    type="number"
                    value={formData.chemicalConsumption?.soda || ''}
                    onChange={(e) => handleChemicalConsumptionChange('soda', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Soda used"
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Auxiliaries</label>
                  <input
                    type="number"
                    value={formData.chemicalConsumption?.auxiliaries || ''}
                    onChange={(e) => handleChemicalConsumptionChange('auxiliaries', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Auxiliaries used"
                    min="0"
                    step="any"
                  />
                </div>
              </div>
            </div>

            {/* Quality Assessment */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Quality Assessment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Color Match</label>
                  <Select.Root value={formData.qualityResults?.colorMatch} onValueChange={(value) => handleQualityResultChange('colorMatch', value)}>
                    <Select.Trigger className={inputClasses}>
                      <Select.Value placeholder="Select Rating" />
                      <Select.Icon>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-xl bg-card border border-border shadow-2xl z-50">
                        <Select.Viewport className="p-2">
                          <SelectItemContent value="excellent">Excellent</SelectItemContent>
                          <SelectItemContent value="good">Good</SelectItemContent>
                          <SelectItemContent value="acceptable">Acceptable</SelectItemContent>
                          <SelectItemContent value="poor">Poor</SelectItemContent>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div>
                  <label className={labelClasses}>Fastness</label>
                  <Select.Root value={formData.qualityResults?.fastness} onValueChange={(value) => handleQualityResultChange('fastness', value)}>
                    <Select.Trigger className={inputClasses}>
                      <Select.Value placeholder="Select Rating" />
                      <Select.Icon>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-xl bg-card border border-border shadow-2xl z-50">
                        <Select.Viewport className="p-2">
                          <SelectItemContent value="excellent">Excellent</SelectItemContent>
                          <SelectItemContent value="good">Good</SelectItemContent>
                          <SelectItemContent value="acceptable">Acceptable</SelectItemContent>
                          <SelectItemContent value="poor">Poor</SelectItemContent>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div>
                  <label className={labelClasses}>Uniformity</label>
                  <Select.Root value={formData.qualityResults?.uniformity} onValueChange={(value) => handleQualityResultChange('uniformity', value)}>
                    <Select.Trigger className={inputClasses}>
                      <Select.Value placeholder="Select Rating" />
                      <Select.Icon>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-xl bg-card border border-border shadow-2xl z-50">
                        <Select.Viewport className="p-2">
                          <SelectItemContent value="excellent">Excellent</SelectItemContent>
                          <SelectItemContent value="good">Good</SelectItemContent>
                          <SelectItemContent value="acceptable">Acceptable</SelectItemContent>
                          <SelectItemContent value="poor">Poor</SelectItemContent>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              </div>
            </div>

            {/* Resource Consumption */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Droplets className="h-5 w-5 mr-2 text-primary" />
                Resource Consumption
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Water Consumption (L)</label>
                  <input
                    type="number"
                    value={formData.waterConsumption || ''}
                    onChange={(e) => handleInputChange('waterConsumption', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Water used"
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Energy Consumption (kWh)</label>
                  <input
                    type="number"
                    value={formData.energyConsumption || ''}
                    onChange={(e) => handleInputChange('energyConsumption', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Energy used"
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Waste Generated (kg)</label>
                  <input
                    type="number"
                    value={formData.wasteGenerated || ''}
                    onChange={(e) => handleInputChange('wasteGenerated', parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Waste amount"
                    min="0"
                    step="any"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Garments Specific Fields */}
        {productionType === 'garments' && (
          <div className="space-y-6">
            {/* Product Details */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Shirt className="h-5 w-5 mr-2 text-primary" />
                Product Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Style *</label>
                  <Select.Root value={formData.style} onValueChange={(value) => handleInputChange('style', value)}>
                    <Select.Trigger className={inputClasses}>
                      <Select.Value placeholder="Select Style" />
                      <Select.Icon>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-xl bg-card border border-border shadow-2xl z-50">
                        <Select.Viewport className="p-2 max-h-48 overflow-y-auto">
                          {GARMENT_STYLES.map(style => (
                            <SelectItemContent key={style} value={style}>{style}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.style && <p className={errorClasses}>{errors.style}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Size *</label>
                  <Select.Root value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
                    <Select.Trigger className={inputClasses}>
                      <Select.Value placeholder="Select Size" />
                      <Select.Icon>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden rounded-xl bg-card border border-border shadow-2xl z-50">
                        <Select.Viewport className="p-2">
                          {GARMENT_SIZES.map(size => (
                            <SelectItemContent key={size} value={size}>{size}</SelectItemContent>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                  {errors.size && <p className={errorClasses}>{errors.size}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Color *</label>
                  <TypedMemoryInput
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className={inputClasses}
                    storageKey="garmentsColor"
                    placeholder="Color name"
                  />
                  {errors.color && <p className={errorClasses}>{errors.color}</p>}
                </div>
              </div>
            </div>

            {/* Production Targets */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Production Targets & Results
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClasses}>Target Quantity (pcs) *</label>
                  <input
                    type="number"
                    value={formData.targetQuantity || ''}
                    onChange={(e) => handleInputChange('targetQuantity', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Target quantity"
                    min="0"
                  />
                  {errors.targetQuantity && <p className={errorClasses}>{errors.targetQuantity}</p>}
                </div>

                <div>
                  <label className={labelClasses}>Completed Quantity (pcs)</label>
                  <input
                    type="number"
                    value={formData.completedQuantity || ''}
                    onChange={(e) => handleInputChange('completedQuantity', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Completed quantity"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    <BarChart3 className="inline h-4 w-4 mr-2" />
                    Efficiency (%)
                  </label>
                  <input
                    type="text"
                    value={`${formData.efficiency || 0}%`}
                    readOnly
                    className={`${inputClasses} bg-muted/30 font-bold text-primary`}
                  />
                </div>
              </div>
            </div>

            {/* Operations Tracking */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Scissors className="h-5 w-5 mr-2 text-primary" />
                Operations Tracking (pieces completed)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={labelClasses}>Cutting</label>
                  <input
                    type="number"
                    value={formData.operations?.cutting || ''}
                    onChange={(e) => handleOperationChange('cutting', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Pieces cut"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Sewing</label>
                  <input
                    type="number"
                    value={formData.operations?.sewing || ''}
                    onChange={(e) => handleOperationChange('sewing', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Pieces sewn"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Finishing</label>
                  <input
                    type="number"
                    value={formData.operations?.finishing || ''}
                    onChange={(e) => handleOperationChange('finishing', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Pieces finished"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Packing</label>
                  <input
                    type="number"
                    value={formData.operations?.packing || ''}
                    onChange={(e) => handleOperationChange('packing', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Pieces packed"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Defects & Rework */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Defects & Rework Tracking
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className={labelClasses}>Stitching Defects</label>
                  <input
                    type="number"
                    value={formData.defects?.stitchingDefects || ''}
                    onChange={(e) => handleDefectChange('stitchingDefects', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Stitching issues"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Measurement Defects</label>
                  <input
                    type="number"
                    value={formData.defects?.measurementDefects || ''}
                    onChange={(e) => handleDefectChange('measurementDefects', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Size issues"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Fabric Defects</label>
                  <input
                    type="number"
                    value={formData.defects?.fabricDefects || ''}
                    onChange={(e) => handleDefectChange('fabricDefects', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Fabric issues"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Other Defects</label>
                  <input
                    type="number"
                    value={formData.defects?.other || ''}
                    onChange={(e) => handleDefectChange('other', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Other issues"
                    min="0"
                  />
                </div>

                <div>
                  <label className={labelClasses}>Rework (pcs)</label>
                  <input
                    type="number"
                    value={formData.rework || ''}
                    onChange={(e) => handleInputChange('rework', parseInt(e.target.value) || 0)}
                    className={inputClasses}
                    placeholder="Rework pieces"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quality & Notes Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={sectionClasses}
      >
        <div className={sectionHeaderClasses}>
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Quality Assessment & Notes</h3>
            <p className="text-muted-foreground">Final quality grading and additional observations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className={labelClasses}>
              <Award className="inline h-4 w-4 mr-2" />
              Quality Grade
            </label>
            <Select.Root value={formData.qualityGrade} onValueChange={(value) => handleInputChange('qualityGrade', value)}>
              <Select.Trigger className={inputClasses}>
                <Select.Value placeholder="Select Quality Grade" />
                <Select.Icon>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden rounded-xl bg-card border border-border shadow-2xl z-50">
                  <Select.Viewport className="p-2">
                    {QUALITY_GRADES.map(grade => (
                      <Select.Item
                        key={grade.value}
                        value={grade.value}
                        className="relative flex items-center rounded-lg py-3 pl-4 pr-12 text-foreground text-sm outline-none data-[highlighted]:bg-primary/20 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            grade.value === 'A' ? 'bg-green-500' :
                            grade.value === 'B' ? 'bg-blue-500' :
                            grade.value === 'C' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <Select.ItemText>{grade.label}</Select.ItemText>
                        </div>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          <div>
            <label className={labelClasses}>
              <Settings className="inline h-4 w-4 mr-2" />
              Production Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className={`${inputClasses} min-h-[120px] resize-none`}
              rows={5}
              placeholder="Add any observations, issues, or special notes about this production run..."
            />
          </div>
        </div>
      </motion.div>

      {/* Summary Card */}
      {(formData.efficiency > 0 || formData.totalHours > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-2xl border border-border/50"
        >
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-3 text-primary" />
            Production Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Working Hours</p>
                  <p className="text-2xl font-bold text-foreground">{formData.totalHours || 0}h</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <p className="text-2xl font-bold text-foreground">{formData.efficiency || 0}%</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quality Grade</p>
                  <p className="text-2xl font-bold text-foreground">{formData.qualityGrade || 'A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Defects</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formData.defects ? Object.values(formData.defects).reduce((sum: number, val: any) => sum + (val || 0), 0) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};